extends CanvasLayer

@onready var health_label: Label = $Root/HealthLabel
@onready var mana_label: Label = $Root/ManaLabel
@onready var version_label: Label = $Root/VersionLabel
@onready var controls_label: Label = $Root/ControlsLabel
@onready var objective_label: Label = $Root/ObjectiveLabel
@onready var status_label: Label = $Root/StatusLabel
@onready var enemy_label: Label = $Root/EnemyLabel
@onready var feedback_label: Label = $Root/FeedbackLabel

var _feedback_tween: Tween


func _ready() -> void:
	version_label.text = "Godot G2.1 - baseline visual"
	controls_label.text = "WASD/setas: mover | 1 ou clique: ataque"
	objective_label.text = "Aproxime-se do inimigo e ataque."
	status_label.text = "Aproxime-se do inimigo e ataque."


func set_health(current: int, maximum: int) -> void:
	health_label.text = "Vida: %d/%d" % [current, maximum]


func set_mana(current: int, maximum: int) -> void:
	mana_label.text = "Mana: %d/%d" % [current, maximum]


func set_enemy_health(current: int, maximum: int) -> void:
	enemy_label.text = "Inimigo: %d/%d" % [current, maximum]


func set_status(text: String) -> void:
	status_label.text = text


func show_feedback(text: String, color: Color) -> void:
	if _feedback_tween != null:
		_feedback_tween.kill()

	feedback_label.text = text
	feedback_label.modulate = color
	_feedback_tween = create_tween()
	_feedback_tween.tween_interval(0.75)
	_feedback_tween.tween_property(feedback_label, "modulate:a", 0.0, 0.35)
	_feedback_tween.finished.connect(func() -> void:
		feedback_label.text = ""
		feedback_label.modulate.a = 1.0
	)
