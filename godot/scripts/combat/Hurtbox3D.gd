extends Area3D
class_name Hurtbox3D

@export var health_component_path: NodePath
@export var target_path: NodePath = NodePath("..")

@onready var health_component: Node = _find_health_component()


func receive_hit(damage: float, source: Node = null) -> void:
	if health_component != null and health_component.has_method("take_damage"):
		health_component.call("take_damage", damage, source)
		return

	var target := get_node_or_null(target_path)
	if target != null and target.has_method("receive_damage"):
		target.receive_damage(damage)


func set_hurtbox_enabled(value: bool) -> void:
	monitorable = value
	monitoring = value
	for child in get_children():
		if child is CollisionShape3D:
			child.disabled = not value


func _find_health_component() -> Node:
	if health_component_path != NodePath():
		return get_node_or_null(health_component_path)

	var target := get_node_or_null(target_path)
	if target != null:
		var child := target.get_node_or_null("HealthComponent")
		if child != null and child.has_method("take_damage"):
			return child

	return null
