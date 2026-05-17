extends Node3D
class_name ArenaManager3D

enum ArenaState { IDLE, WAVE_ACTIVE, WAVE_CLEARED }

signal wave_started(wave: int)
signal wave_cleared(wave: int)
signal arena_state_changed(state: ArenaState)

@export var enemy_scene: PackedScene = preload("res://scenes/enemies/EnemyDummy3D.tscn")
@export var starting_wave: int = 1
@export var enemies_per_wave_base: int = 2
@export var enemies_per_wave_increment: int = 1
@export var max_active_enemies: int = 10

var current_wave: int = 0
var enemies_alive: int = 0
var arena_started: bool = false
var _current_state: ArenaState = ArenaState.IDLE

func _ready() -> void:
	add_to_group("arena_manager")
	_set_state(ArenaState.IDLE)

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("arena_start"):
		if _current_state == ArenaState.IDLE:
			start_arena()
		elif _current_state == ArenaState.WAVE_CLEARED:
			next_wave()

func start_arena() -> void:
	arena_started = true
	current_wave = starting_wave - 1
	print("Arena started")
	next_wave()

func next_wave() -> void:
	current_wave += 1
	_set_state(ArenaState.WAVE_ACTIVE)
	emit_signal("wave_started", current_wave)
	print("Wave %d started" % current_wave)
	_spawn_wave()

func _spawn_wave() -> void:
	var spawn_points = get_tree().get_nodes_in_group("spawn_point")
	if spawn_points.is_empty():
		push_error("No spawn points found in group 'spawn_point'")
		return

	var total_to_spawn = enemies_per_wave_base + (current_wave - 1) * enemies_per_wave_increment
	enemies_alive = total_to_spawn
	
	for i in range(total_to_spawn):
		var sp = spawn_points[i % spawn_points.size()]
		var enemy = enemy_scene.instantiate()
		get_parent().add_child(enemy)
		enemy.global_position = sp.global_position
		
		# Connect death signal if health component exists
		var health = enemy.get_node_or_null("HealthComponent")
		if health:
			health.connect("died", _on_enemy_died)

func _on_enemy_died(_source: Node) -> void:
	enemies_alive -= 1
	if enemies_alive <= 0:
		_complete_wave()

func _complete_wave() -> void:
	print("Wave %d cleared" % current_wave)
	_set_state(ArenaState.WAVE_CLEARED)
	emit_signal("wave_cleared", current_wave)

func _set_state(new_state: ArenaState) -> void:
	_current_state = new_state
	emit_signal("arena_state_changed", _current_state)

func get_current_state_name() -> String:
	match _current_state:
		ArenaState.IDLE: return "PRONTO"
		ArenaState.WAVE_ACTIVE: return "EM COMBATE"
		ArenaState.WAVE_CLEARED: return "ONDA CONCLUÍDA"
	return "DESCONHECIDO"

func get_current_state() -> ArenaState:
	return _current_state
