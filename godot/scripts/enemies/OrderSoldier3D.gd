extends CharacterBody3D
class_name OrderSoldier3D

## OrderSoldier3D - Human soldier enemy of the White Flame Order

@export var max_health: float = 50.0
@export var move_speed: float = 4.5
@export var acceleration: float = 12.0
@export var gravity: float = 24.0
@export var aggro_range: float = 10.0
@export var attack_range: float = 1.4
@export var attack_damage: float = 15.0
@export var attack_cooldown: float = 1.0
@export var essence_reward: int = 8
@export var xp_reward: int = 25
@export var corpse_scene: PackedScene
@export var loot_drop_chance: float = 0.35
@export var loot_scene: PackedScene

var _dead: bool = false
var _attack_cooldown_timer: float = 0.0
var _corpse_spawned: bool = false

@onready var _health_component: Node = $HealthComponent
@onready var _body: MeshInstance3D = $MeshInstance3D


func _ready() -> void:
	add_to_group("enemy")
	if _health_component:
		_health_component.set("max_health", max_health)
		_health_component.set("current_health", max_health)
		if _health_component.has_signal("died"):
			_health_component.connect("died", Callable(self, "_on_died"))


func _physics_process(delta: float) -> void:
	if _dead:
		return

	_attack_cooldown_timer = maxf(_attack_cooldown_timer - delta, 0.0)

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	var target := _find_target()
	if target != null:
		var distance := _flat_distance_to(target.global_position)
		if distance <= attack_range:
			_apply_horizontal_velocity(Vector3.ZERO, delta)
			_attack_target(target)
			move_and_slide()
			return
		_move_toward_position(target.global_position, delta)
		move_and_slide()
		return

	_apply_horizontal_velocity(Vector3.ZERO, delta)
	move_and_slide()


func receive_damage(amount: float, source: Node = null) -> void:
	if _dead:
		return
	if _health_component and _health_component.has_method("take_damage"):
		_health_component.call("take_damage", amount, source)


func is_dead() -> bool:
	return _dead


func _on_died(source: Node) -> void:
	if _dead:
		return
	_dead = true
	remove_from_group("enemy")
	set_physics_process(false)
	velocity = Vector3.ZERO
	collision_layer = 0
	collision_mask = 0
	print("Order Soldier defeated")
	_grant_essence(source)
	_grant_xp(source)
	_drop_loot()
	_spawn_corpse()
	queue_free()


func _grant_essence(source: Node) -> void:
	var player := _find_reward_player(source)
	if player == null:
		return
	var essence_component := player.get_node_or_null("EssenceComponent")
	if essence_component and essence_component.has_method("add_essence"):
		essence_component.call("add_essence", essence_reward)


func _grant_xp(source: Node) -> void:
	var player := _find_reward_player(source)
	if player == null:
		return
	var xp_component := player.get_node_or_null("ExperienceComponent")
	if xp_component and xp_component.has_method("add_xp"):
		xp_component.call("add_xp", xp_reward)


func _drop_loot() -> void:
	if loot_scene == null or randf() > loot_drop_chance:
		return
	var loot = loot_scene.instantiate() as Node3D
	if loot:
		get_parent().add_child(loot)
		loot.global_position = global_position


func _spawn_corpse() -> void:
	if _corpse_spawned or corpse_scene == null:
		return
	_corpsespawned = true
	var corpse := corpse_scene.instantiate() as Node3D
	if corpse == null:
		return
	var spawn_parent := get_parent()
	if spawn_parent == null:
		spawn_parent = get_tree().current_scene
	spawn_parent.add_child(corpse)
	corpse.global_position = global_position


func _find_target() -> Node3D:
	var nearest: Node3D = null
	var nearest_distance := aggro_range
	for candidate in get_tree().get_nodes_in_group("player") + get_tree().get_nodes_in_group("summon"):
		var target := candidate as Node3D
		if target == null or not is_instance_valid(target) or not target.is_inside_tree():
			continue
		if target.has_method("is_dead") and target.call("is_dead"):
			continue
		var distance := _flat_distance_to(target.global_position)
		if distance <= nearest_distance:
			nearest = target
			nearest_distance = distance
	return nearest


func _attack_target(target: Node3D) -> void:
	if _attack_cooldown_timer > 0.0:
		return
	_attack_cooldown_timer = attack_cooldown
	if target.has_method("receive_damage"):
		target.call("receive_damage", attack_damage, self)
	else:
		var health_component := target.get_node_or_null("HealthComponent")
		if health_component and health_component.has_method("take_damage"):
			health_component.call("take_damage", attack_damage, self)


func _move_toward_position(target_position: Vector3, delta: float) -> void:
	var to_target := target_position - global_position
	to_target.y = 0.0
	if to_target.length_squared() <= 0.001:
		_apply_horizontal_velocity(Vector3.ZERO, delta)
		return
	var direction := to_target.normalized()
	rotation.y = lerp_angle(rotation.y, atan2(-direction.x, -direction.z), 8.0 * delta)
	_apply_horizontal_velocity(direction * move_speed, delta)


func _apply_horizontal_velocity(target_velocity: Vector3, delta: float) -> void:
	velocity.x = move_toward(velocity.x, target_velocity.x, acceleration * delta)
	velocity.z = move_toward(velocity.z, target_velocity.z, acceleration * delta)


func _flat_distance_to(target_position: Vector3) -> float:
	var offset := target_position - global_position
	offset.y = 0.0
	return offset.length()


func _find_reward_player(source: Node) -> Node3D:
	if source == null:
		return null
	if source.is_in_group("player"):
		return source as Node3D
	if source.is_in_group("summon"):
		var owner := source.get("owner_node") as Node3D
		if owner != null:
			return owner
	var parent := source.get_parent()
	while parent != null:
		if parent.is_in_group("player"):
			return parent as Node3D
		if parent.is_in_group("summon"):
			var summon_owner := parent.get("owner_node") as Node3D
			if summon_owner != null:
				return summon_owner
		parent = parent.get_parent()
	return null
