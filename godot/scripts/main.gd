extends Node2D

@onready var player: CharacterBody2D = $Player
@onready var enemy: StaticBody2D = $Enemy
@onready var hud: CanvasLayer = $HUD


func _ready() -> void:
	player.health_changed.connect(hud.set_health)
	player.mana_changed.connect(hud.set_mana)
	player.status_changed.connect(hud.set_status)
	player.attack_performed.connect(_on_player_attack_performed)

	if is_instance_valid(enemy):
		enemy.health_changed.connect(hud.set_enemy_health)
		enemy.defeated.connect(_on_enemy_defeated)

	hud.set_health(player.health, player.max_health)
	hud.set_mana(player.mana, player.max_mana)
	hud.set_enemy_health(enemy.health, enemy.max_health)


func _on_player_attack_performed(damage: int, hits: int) -> void:
	if hits > 0:
		hud.set_status("Ataque basico: %d dano." % damage)


func _on_enemy_defeated() -> void:
	hud.set_enemy_health(0, enemy.max_health)
	hud.set_status("Inimigo derrotado.")
