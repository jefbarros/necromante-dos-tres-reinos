extends CanvasLayer

@onready var health_label: Label = $Root/HealthLabel
@onready var mana_label: Label = $Root/ManaLabel
@onready var version_label: Label = $Root/VersionLabel
@onready var controls_label: Label = $Root/ControlsLabel
@onready var status_label: Label = $Root/StatusLabel
@onready var enemy_label: Label = $Root/EnemyLabel


func _ready() -> void:
	version_label.text = "Godot G1 - prototipo minimo"
	controls_label.text = "WASD/setas: mover | 1 ou clique: ataque"
	status_label.text = "Aproxime-se do inimigo e ataque."


func set_health(current: int, maximum: int) -> void:
	health_label.text = "Vida: %d/%d" % [current, maximum]


func set_mana(current: int, maximum: int) -> void:
	mana_label.text = "Mana: %d/%d" % [current, maximum]


func set_enemy_health(current: int, maximum: int) -> void:
	enemy_label.text = "Inimigo: %d/%d" % [current, maximum]


func set_status(text: String) -> void:
	status_label.text = text
