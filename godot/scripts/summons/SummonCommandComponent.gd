extends Node
class_name SummonCommandComponent

const SummonBrain := preload("res://scripts/summons/SummonBrain3D.gd")

signal command_changed(command_name: String)

var current_mode: int = SummonBrain.CommandMode.FOLLOW


func set_command_mode(mode: int) -> void:
	current_mode = mode
	for summon in _get_owned_summons():
		if summon.has_method("set_command_mode"):
			summon.call("set_command_mode", current_mode)

	var command_name: String = SummonBrain.get_command_name(current_mode)
	print("Summon command: %s" % command_name)
	command_changed.emit(command_name)


func get_command_name() -> String:
	return SummonBrain.get_command_name(current_mode)


func apply_current_mode_to(summon: Node) -> void:
	if summon != null and summon.has_method("set_command_mode"):
		summon.call("set_command_mode", current_mode)


func _get_owned_summons() -> Array[Node3D]:
	var owner_node := get_parent() as Node3D
	var summons: Array[Node3D] = []

	for summon in get_tree().get_nodes_in_group("summon"):
		var summon_node := summon as Node3D
		if summon_node == null or not is_instance_valid(summon_node) or not summon_node.is_inside_tree():
			continue
		if summon_node.has_method("is_dead") and summon_node.call("is_dead"):
			continue
		if owner_node != null and summon_node.get("owner_node") != owner_node:
			continue

		summons.append(summon_node)

	return summons
