extends CanvasLayer
class_name PrototypeHUD

@export var max_summons: int = 2

@onready var _summon_label: Label = $Panel/MarginContainer/VBoxContainer/SummonLabel
@onready var _hint_label: Label = $Panel/MarginContainer/VBoxContainer/HintLabel


func _ready() -> void:
	_hint_label.text = "R: reanimar cadaver proximo"
	_update_labels()


func _process(_delta: float) -> void:
	_update_labels()


func _update_labels() -> void:
	var player := get_tree().get_first_node_in_group("player")
	var limit := max_summons
	if player != null:
		var skill := player.get_node_or_null("RaiseSkeletonSkill")
		if skill != null:
			limit = int(skill.get("max_active_summons"))

	_summon_label.text = "Servos: %d/%d" % [get_tree().get_nodes_in_group("summon").size(), limit]
