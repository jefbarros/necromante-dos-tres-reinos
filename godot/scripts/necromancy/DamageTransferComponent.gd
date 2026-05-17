extends Node
class_name DamageTransferComponent

@export_range(0.0, 1.0, 0.05) var transfer_percent: float = 0.20
@export var enabled: bool = true


func apply_damage_with_transfer(amount: float, source: Node = null) -> float:
	if not enabled or amount <= 0.0:
		return amount

	var summons := _get_active_owned_summons()
	if summons.is_empty():
		print("No summons available for damage transfer")
		return amount

	var transferred_damage := amount * clampf(transfer_percent, 0.0, 1.0)
	var damage_per_summon := transferred_damage / float(summons.size())

	for summon in summons:
		if summon.has_method("receive_damage"):
			summon.call("receive_damage", damage_per_summon, source)
			continue

		var health_component := summon.get_node_or_null("HealthComponent")
		if health_component != null and health_component.has_method("take_damage"):
			health_component.call("take_damage", damage_per_summon, source)

	print("Damage transferred to summons: %.1f" % transferred_damage)
	return maxf(amount - transferred_damage, 0.0)


func _get_active_owned_summons() -> Array[Node3D]:
	var owner_node := get_parent() as Node3D
	var active_summons: Array[Node3D] = []

	for summon in get_tree().get_nodes_in_group("summon"):
		var summon_node := summon as Node3D
		if summon_node == null or not is_instance_valid(summon_node) or not summon_node.is_inside_tree():
			continue
		if summon_node.has_method("is_dead") and summon_node.call("is_dead"):
			continue
		if owner_node != null and summon_node.get("owner_node") != owner_node:
			continue

		active_summons.append(summon_node)

	return active_summons
