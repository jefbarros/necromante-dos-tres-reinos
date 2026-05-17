extends CharacterBody3D
class_name SkeletonArcherServant3D

## SkeletonArcherServant3D - Ranged skeleton summon

const SummonBrain := preload("res://scripts/summons/SummonBrain3D.gd")

enum State {
	FOLLOW_OWNER,
	CHASE_TARGET,
	ATTACK_TARGET,
	DEAD,
}

@export var follow_distance: float = 3.5
@export var move_speed: float = 3.8
@export var acceleration: float = 10.0
@export var gravity: float = 24.0
@export var aggro_range: float = 12.0
@export var protect_range: float = 4.0
@export var attack_command_aggro_range: float = 14.0
@export var attack_range: float = 8.0
@export var attack_damage: float = 8.0
@export var attack_cooldown: float = 1.2
@export var max_health: float = 25.0
@export var owner_path: NodePath

var owner_node: Node3D
var state: int = State.FOLLOW_OWNER
var command_mode: int = SummonBrain.CommandMode.FOLLOW
var _target: Node3D
var _attack_cooldown_timer: float = 0.0

@onready var _health_component: Node = $HealthComponent
@onready var _collision_shape: CollisionShape3D = $CollisionShape3D


func _ready() -> void:
	add_to_group("summon")
	_resolve_owner()
	_health_component.set("max_health", max_health)
	_health_component.set("current_health", max_health)
	if _health_component.has_signal("died"):
		_health_component.connect("died", Callable(self, "_on_died"))


func _physics_process(delta: float) -> void:
	if state == State.DEAD:
		return

	_attack_cooldown_timer = maxf(_attack_cooldown_timer - delta, 0.0)

	if owner_node == null or not is_instance_valid(owner_node):
		_resolve_owner()
		if owner_node == null:
			return

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	_update_target()

	if _target != null:
		var target_distance := _flat_distance_to(_target.global_position)
		if target_distance <= attack_range:
			state = State.ATTACK_TARGET
			_attack_target()
			_apply_horizontal_velocity(Vector3.ZERO, delta)
		else:
			state = State.CHASE_TARGET
			_move_toward_position(_target.global_position, delta)

		move_and_slide()
		return

	state = State.FOLLOW_OWNER
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


func receive_damage(amount: float, source: Node = null) -> void:
	if state == State.DEAD:
		return

	if _health_component.has_method("take_damage"):
		_health_component.call("take_damage", amount, source)


func set_command_mode(mode: int) -> void:
	command_mode = mode
	if command_mode == SummonBrain.CommandMode.RECALL:
		_target = null


func is_dead() -> bool:
	return state == State.DEAD


func _resolve_owner() -> void:
	if owner_path != NodePath():
		owner_node = get_node_or_null(owner_path) as Node3D
		if owner_node != null:
			return

	owner_node = get_tree().get_first_node_in_group("player") as Node3D


func _update_target() -> void:
	if command_mode == SummonBrain.CommandMode.RECALL:
		_target = null
		return

	var current_aggro_range := _get_current_aggro_range()
	if _is_valid_enemy(_target) and _flat_distance_to(_target.global_position) <= current_aggro_range:
		return

	_target = _find_nearest_enemy()


func _find_nearest_enemy() -> Node3D:
	var nearest: Node3D = null
	var nearest_distance := _get_current_aggro_range()
	for enemy in get_tree().get_nodes_in_group("enemy"):
		var enemy_node := enemy as Node3D
		if not _is_valid_enemy(enemy_node):
			continue

		var distance := _flat_distance_to(enemy_node.global_position)
		if distance <= nearest_distance:
			nearest = enemy_node
			nearest_distance = distance

	return nearest


func _get_current_aggro_range() -> float:
	match command_mode:
		SummonBrain.CommandMode.ATTACK:
			return attack_command_aggro_range
		SummonBrain.CommandMode.RECALL:
			return 0.0
		_:
			return protect_range


func _is_valid_enemy(enemy: Node3D) -> bool:
	if enemy == null or not is_instance_valid(enemy) or not enemy.is_inside_tree():
		return false
	if enemy.has_method("is_dead") and enemy.call("is_dead"):
		return false
	return true


func _move_toward_position(target_position: Vector3, delta: float) -> void:
	var to_target := target_position - global_position
	to_target.y = 0.0
	if to_target.length_squared() <= 0.001:
		_apply_horizontal_velocity(Vector3.ZERO, delta)
		return

	var direction := to_target.normalized()
	rotation.y = lerp_angle(rotation.y, atan2(-direction.x, -direction.z), 10.0 * delta)
	_apply_horizontal_velocity(direction * move_speed, delta)


func _apply_horizontal_velocity(target_velocity: Vector3, delta: float) -> void:
	velocity.x = move_toward(velocity.x, target_velocity.x, acceleration * delta)
	velocity.z = move_toward(velocity.z, target_velocity.z, acceleration * delta)


func _attack_target() -> void:
	if _target == null or _attack_cooldown_timer > 0.0:
		return

	_attack_cooldown_timer = attack_cooldown
	if _target.has_method("receive_damage"):
		_target.call("receive_damage", attack_damage, self)
	else:
		var health_component := _target.get_node_or_null("HealthComponent")
		if health_component != null and health_component.has_method("take_damage"):
			health_component.call("take_damage", attack_damage, self)

	print("Skeleton Archer attacked for %.1f damage" % attack_damage)


func _flat_distance_to(target_position: Vector3) -> float:
	var offset := target_position - global_position
	offset.y = 0.0
	return offset.length()


func _on_died(source: Node) -> void:
	state = State.DEAD
	remove_from_group("summon")
	set_physics_process(false)
	velocity = Vector3.ZERO
	collision_layer = 0
	collision_mask = 0
	if _collision_shape != null:
		_collision_shape.set_deferred("disabled", true)
	print("Skeleton Archer died")
	queue_free()
