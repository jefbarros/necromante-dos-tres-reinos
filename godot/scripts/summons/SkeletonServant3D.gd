extends CharacterBody3D

@export var follow_distance: float = 2.2
@export var move_speed: float = 4.2
@export var acceleration: float = 12.0
@export var gravity: float = 24.0
@export var owner_path: NodePath

var owner_node: Node3D


func _ready() -> void:
	add_to_group("summon")
	_resolve_owner()


func _physics_process(delta: float) -> void:
	if owner_node == null or not is_instance_valid(owner_node):
		_resolve_owner()
		if owner_node == null:
			return

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	var to_owner := owner_node.global_position - global_position
	to_owner.y = 0.0
	var distance := to_owner.length()
	var target_velocity := Vector3.ZERO

	if distance > follow_distance:
		var direction := to_owner.normalized()
		target_velocity = direction * move_speed
		rotation.y = lerp_angle(rotation.y, atan2(-direction.x, -direction.z), 10.0 * delta)

	velocity.x = move_toward(velocity.x, target_velocity.x, acceleration * delta)
	velocity.z = move_toward(velocity.z, target_velocity.z, acceleration * delta)
	move_and_slide()


func _resolve_owner() -> void:
	if owner_path != NodePath():
		owner_node = get_node_or_null(owner_path) as Node3D
		if owner_node != null:
			return

	owner_node = get_tree().get_first_node_in_group("player") as Node3D
