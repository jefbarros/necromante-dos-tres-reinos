extends Area3D
class_name Hitbox3D

@export var damage: float = 10.0
@export var active: bool = false
@export var source_path: NodePath

var _hit_targets: Array[Area3D] = []


func _ready() -> void:
	area_entered.connect(_on_area_entered)
	set_active(active)


func set_active(value: bool) -> void:
	active = value
	monitoring = active
	visible = active

	if active:
		_hit_targets.clear()
		call_deferred("_apply_overlapping_hits")


func _apply_overlapping_hits() -> void:
	if not active:
		return

	for area in get_overlapping_areas():
		_try_hit(area)


func _on_area_entered(area: Area3D) -> void:
	_try_hit(area)


func _try_hit(area: Area3D) -> void:
	if not active or area in _hit_targets:
		return

	if not area.has_method("receive_hit"):
		return

	_hit_targets.append(area)
	area.receive_hit(damage, _get_source())


func _get_source() -> Node:
	if source_path != NodePath():
		return get_node_or_null(source_path)

	return owner if owner != null else self
