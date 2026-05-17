extends CanvasLayer
class_name PrototypeHUD

@export var max_summons: int = 2

@onready var _health_label: Label = $Panel/MarginContainer/VBoxContainer/HealthLabel
@onready var _essence_label: Label = $Panel/MarginContainer/VBoxContainer/EssenceLabel
@onready var _summon_label: Label = $Panel/MarginContainer/VBoxContainer/SummonLabel
@onready var _command_label: Label = $Panel/MarginContainer/VBoxContainer/CommandLabel
@onready var _hint_label: Label = $Panel/MarginContainer/VBoxContainer/HintLabel


func _ready() -> void:
	_hint_label.text = "R reanima | 1 seguir | 2 atacar | 3 reunir"
	_update_labels()


func _process(_delta: float) -> void:
	_update_labels()


func _update_labels() -> void:
	var player := get_tree().get_first_node_in_group("player")
	var limit := max_summons
	var active_summons := get_tree().get_nodes_in_group("summon").size()
	var command_name := "FOLLOW"

	if player != null:
		var health := player.get_node_or_null("HealthComponent")
		if health != null:
			_health_label.text = "HP: %.0f/%.0f" % [
				float(health.get("current_health")),
				float(health.get("max_health")),
			]

		var essence := player.get_node_or_null("EssenceComponent")
		if essence != null:
			_essence_label.text = "Essencia: %d/%d" % [
				int(essence.get("current_essence")),
				int(essence.get("max_essence")),
			]

		var skill := player.get_node_or_null("RaiseSkeletonSkill")
		if skill != null:
			limit = int(skill.get("max_active_summons"))
			if skill.has_method("get_active_summons"):
				active_summons = int(skill.call("get_active_summons"))

		var command_component := player.get_node_or_null("SummonCommandComponent")
		if command_component != null and command_component.has_method("get_command_name"):
			command_name = String(command_component.call("get_command_name"))
	else:
		_health_label.text = "HP: -/-"
		_essence_label.text = "Essencia: -/-"

	_summon_label.text = "Servos: %d/%d" % [active_summons, limit]
	_command_label.text = "Comando: %s" % command_name
