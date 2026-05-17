extends Node2D

enum GameState { START, PLAYING, VICTORY, GAME_OVER }

const MAX_SERVANTS := 3
const SOUL_CAPTURE_RANGE := 72.0
const DROP_CAPTURE_RANGE := 48.0
const ARENA_MIN := Vector2(-410, -245)
const ARENA_MAX := Vector2(410, 245)

var game_state: GameState = GameState.START
var wave_index: int = 0
var living_enemies: int = 0
var servants: Array[Node2D] = []
var souls: Array[Area2D] = []
var drops: Array[Area2D] = []
var inventory := {
	"pocao": 1,
	"essencia": 0,
	"fragmento": 0,
}
var inventory_open := false
var raised_first_servant := false
var guardian_spawned := false

var waves := [
	[
		{"type": "rapido", "name": "Carcaca veloz", "health": 44, "speed": 122.0, "damage": 4, "xp": 35, "drop_chance": 0.65},
		{"type": "rapido", "name": "Carcaca veloz", "health": 44, "speed": 122.0, "damage": 4, "xp": 35, "drop_chance": 0.65},
	],
	[
		{"type": "medio", "name": "Devorador", "health": 84, "speed": 88.0, "damage": 7, "xp": 50, "drop_chance": 0.75},
		{"type": "rapido", "name": "Carcaca veloz", "health": 50, "speed": 128.0, "damage": 5, "xp": 38, "drop_chance": 0.7},
		{"type": "medio", "name": "Devorador", "health": 84, "speed": 88.0, "damage": 7, "xp": 50, "drop_chance": 0.75},
	],
	[
		{"type": "elite", "name": "Guardiao da cripta", "health": 170, "speed": 68.0, "damage": 12, "xp": 120, "drop_chance": 1.0},
		{"type": "medio", "name": "Devorador", "health": 92, "speed": 90.0, "damage": 8, "xp": 55, "drop_chance": 0.8},
	],
]

@onready var player: CharacterBody2D = $Player
@onready var hud: CanvasLayer = $HUD
@onready var enemies_root: Node2D = $Enemies
@onready var souls_root: Node2D = $Souls
@onready var servants_root: Node2D = $Servants
@onready var drops_root: Node2D = $Drops
@onready var enemy_scene: PackedScene = preload("res://scenes/Enemy.tscn")
@onready var servant_scene: PackedScene = preload("res://scenes/Servant.tscn")


func _ready() -> void:
	player.health_changed.connect(hud.set_health)
	player.mana_changed.connect(hud.set_mana)
	player.status_changed.connect(hud.set_status)
	player.attack_performed.connect(_on_player_attack_performed)
	player.died.connect(_on_player_died)
	hud.start_requested.connect(start_run)
	hud.restart_requested.connect(start_run)
	hud.attack_requested.connect(player.try_attack)
	hud.capture_requested.connect(try_raise_servant)
	hud.potion_requested.connect(use_health_potion)
	_reset_world()
	hud.show_start()


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_C and game_state == GameState.PLAYING:
			try_raise_servant()
		elif event.keycode == KEY_I:
			inventory_open = not inventory_open
			hud.set_inventory_visible(inventory_open)
		elif event.keycode == KEY_Q and game_state == GameState.PLAYING:
			use_health_potion()
		elif event.keycode == KEY_R and game_state != GameState.PLAYING:
			start_run()


func _process(_delta: float) -> void:
	if game_state != GameState.PLAYING:
		return

	_collect_nearby_drops()


func start_run() -> void:
	_reset_world()
	game_state = GameState.PLAYING
	player.can_act = true
	hud.hide_overlay()
	hud.set_status("A run comecou.")
	_start_next_wave()


func _reset_world() -> void:
	game_state = GameState.START
	wave_index = 0
	living_enemies = 0
	servants.clear()
	souls.clear()
	drops.clear()
	raised_first_servant = false
	guardian_spawned = false
	inventory = {"pocao": 1, "essencia": 0, "fragmento": 0}
	inventory_open = false

	for root in [enemies_root, souls_root, servants_root, drops_root]:
		for child in root.get_children():
			child.queue_free()

	player.global_position = Vector2(-135, 0)
	player.reset_run()
	hud.set_level_xp(player.level, player.xp, player.xp_to_next)
	hud.set_wave(0, waves.size())
	hud.set_enemies_remaining(0)
	hud.set_servants(0, MAX_SERVANTS)
	hud.set_inventory(inventory)
	hud.set_inventory_visible(false)
	hud.set_objective("Sobreviva as ondas e erga seu primeiro servo.")


func _start_next_wave() -> void:
	if wave_index >= waves.size():
		_finish_victory()
		return

	var wave: Array = waves[wave_index]
	wave_index += 1
	living_enemies = wave.size()
	guardian_spawned = _wave_has_guardian(wave)
	hud.set_wave(wave_index, waves.size())
	hud.set_enemies_remaining(living_enemies)
	_update_objective()

	var spawn_points := [
		Vector2(245, -130),
		Vector2(270, 120),
		Vector2(-275, -120),
		Vector2(25, 190),
	]
	for i in wave.size():
		var enemy := enemy_scene.instantiate()
		enemy.configure(wave[i], player)
		enemies_root.add_child(enemy)
		enemy.global_position = spawn_points[i % spawn_points.size()]
		enemy.health_changed.connect(_on_enemy_health_changed)
		enemy.defeated.connect(_on_enemy_defeated)

	hud.set_status("Onda %d iniciada." % wave_index)


func _wave_has_guardian(wave: Array) -> bool:
	for config in wave:
		if config.get("type", "") == "elite":
			return true
	return false


func _on_player_attack_performed(damage: int, hits: int) -> void:
	if hits > 0:
		hud.set_status("Ataque acertou: %d dano." % damage)
		hud.show_feedback("-%d" % damage, Color(1.0, 0.78, 0.35, 1.0))
	else:
		hud.set_status("Ataque errou: inimigo fora do alcance.")
		hud.show_feedback("Errou", Color(0.72, 0.78, 0.86, 1.0))


func _on_enemy_health_changed(enemy: Node, current: int, maximum: int) -> void:
	if current > 0:
		hud.set_status("%s: %d/%d" % [enemy.display_name, current, maximum])


func _on_enemy_defeated(enemy: Node, xp_reward: int) -> void:
	living_enemies = max(living_enemies - 1, 0)
	hud.set_enemies_remaining(living_enemies)
	_spawn_soul(enemy.global_position)
	_spawn_drop(enemy.global_position, enemy.drop_chance)

	var leveled: bool = player.gain_xp(xp_reward)
	hud.set_level_xp(player.level, player.xp, player.xp_to_next)
	if leveled:
		hud.show_feedback("Nivel %d" % player.level, Color(0.35, 1.0, 0.78, 1.0))
		hud.set_status("Level up: vida, mana e dano aumentaram.")
	else:
		hud.set_status("%s derrotado. +%d XP." % [enemy.display_name, xp_reward])

	_update_objective()
	if living_enemies == 0:
		if wave_index >= waves.size():
			_finish_victory()
		else:
			hud.set_status("Onda limpa. Proxima onda se aproxima.")
			await get_tree().create_timer(1.3).timeout
			if game_state == GameState.PLAYING:
				_start_next_wave()


func _spawn_soul(position: Vector2) -> void:
	var soul := Area2D.new()
	soul.name = "Soul"
	soul.global_position = position
	soul.collision_layer = 0
	soul.collision_mask = 0
	var shape := CollisionShape2D.new()
	var circle := CircleShape2D.new()
	circle.radius = 20.0
	shape.shape = circle
	soul.add_child(shape)
	var marker := Polygon2D.new()
	marker.color = Color(0.25, 0.95, 0.78, 0.82)
	marker.polygon = PackedVector2Array([Vector2(0, -15), Vector2(13, 0), Vector2(0, 15), Vector2(-13, 0)])
	soul.add_child(marker)
	souls_root.add_child(soul)
	souls.append(soul)


func _spawn_drop(position: Vector2, chance: float) -> void:
	if randf() > chance:
		return

	var types := ["pocao", "essencia", "fragmento"]
	var item_type: String = types[randi() % types.size()]
	var drop := Area2D.new()
	drop.name = "Drop_%s" % item_type
	drop.set_meta("item_type", item_type)
	drop.global_position = position + Vector2(randf_range(-24.0, 24.0), randf_range(-24.0, 24.0))
	var shape := CollisionShape2D.new()
	var circle := CircleShape2D.new()
	circle.radius = 16.0
	shape.shape = circle
	drop.add_child(shape)
	var marker := Polygon2D.new()
	marker.color = _drop_color(item_type)
	marker.polygon = PackedVector2Array([Vector2(-9, -9), Vector2(9, -9), Vector2(9, 9), Vector2(-9, 9)])
	drop.add_child(marker)
	drops_root.add_child(drop)
	drops.append(drop)


func _drop_color(item_type: String) -> Color:
	if item_type == "pocao":
		return Color(0.85, 0.12, 0.16, 1)
	if item_type == "essencia":
		return Color(0.2, 0.85, 0.72, 1)
	return Color(0.55, 0.35, 0.92, 1)


func _collect_nearby_drops() -> void:
	for drop in drops.duplicate():
		if not is_instance_valid(drop):
			drops.erase(drop)
			continue
		if player.global_position.distance_to(drop.global_position) <= DROP_CAPTURE_RANGE:
			var item_type: String = drop.get_meta("item_type")
			inventory[item_type] = inventory.get(item_type, 0) + 1
			hud.set_inventory(inventory)
			hud.set_status("Coletado: %s." % _item_label(item_type))
			drops.erase(drop)
			drop.queue_free()


func try_raise_servant() -> void:
	if servants.size() >= MAX_SERVANTS:
		hud.set_status("Limite de servos atingido.")
		return

	var soul := _nearest_soul()
	if soul == null:
		hud.set_status("Nenhuma alma proxima para erguer.")
		hud.show_feedback("Sem alma", Color(0.72, 0.78, 0.86, 1.0))
		return

	var servant := servant_scene.instantiate()
	servants_root.add_child(servant)
	servant.global_position = soul.global_position
	servant.player = player
	servant.attacked.connect(_on_servant_attacked)
	servants.append(servant)
	souls.erase(soul)
	soul.queue_free()
	hud.set_servants(servants.size(), MAX_SERVANTS)
	hud.show_feedback("+servo", Color(0.25, 0.95, 0.78, 1.0))
	hud.set_status("Servo erguido.")
	raised_first_servant = true
	_update_objective()


func _nearest_soul() -> Area2D:
	var nearest: Area2D
	var nearest_distance := SOUL_CAPTURE_RANGE
	for soul in souls:
		if not is_instance_valid(soul):
			continue
		var distance := player.global_position.distance_to(soul.global_position)
		if distance <= nearest_distance:
			nearest = soul
			nearest_distance = distance
	return nearest


func use_health_potion() -> void:
	if inventory.get("pocao", 0) <= 0:
		hud.set_status("Sem pocao de vida.")
		return

	var healed: int = player.heal(45)
	if healed <= 0:
		hud.set_status("Vida ja esta cheia.")
		return

	inventory["pocao"] -= 1
	hud.set_inventory(inventory)
	hud.show_feedback("+%d vida" % healed, Color(0.35, 1.0, 0.45, 1.0))
	hud.set_status("Pocao de vida usada.")


func _on_servant_attacked(damage: int) -> void:
	hud.show_feedback("Servo -%d" % damage, Color(0.42, 0.95, 0.82, 1.0))


func _on_player_died() -> void:
	if game_state != GameState.PLAYING:
		return
	game_state = GameState.GAME_OVER
	player.can_act = false
	hud.show_game_over()


func _finish_victory() -> void:
	game_state = GameState.VICTORY
	player.can_act = false
	for enemy in enemies_root.get_children():
		enemy.active = false
	hud.set_enemies_remaining(0)
	hud.set_objective("Vitoria alcancada.")
	hud.show_victory()


func _update_objective() -> void:
	if not raised_first_servant and souls.size() > 0:
		hud.set_objective("Capture uma alma com C e erga seu primeiro servo.")
	elif not raised_first_servant:
		hud.set_objective("Sobreviva as ondas e erga seu primeiro servo.")
	elif guardian_spawned and living_enemies > 0:
		hud.set_objective("Derrote o guardiao da cripta.")
	elif wave_index < waves.size():
		hud.set_objective("Sobreviva as ondas restantes.")
	else:
		hud.set_objective("Elimine os inimigos restantes.")


func _item_label(item_type: String) -> String:
	if item_type == "pocao":
		return "pocao de vida"
	if item_type == "essencia":
		return "essencia de alma"
	return "fragmento sombrio"
