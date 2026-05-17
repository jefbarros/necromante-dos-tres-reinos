extends CharacterBody3D

@export var max_health: float = 50.0
@export var patrol_radius: float = 0.75
@export var patrol_speed: float = 0.75
@export var gravity: float = 24.0
@export var corpse_scene: PackedScene = preload("res://scenes/necromancy/Corpse3D.tscn")
@export var essence_reward: int = 10
@export var aggro_range: float = 4.5
@export var attack_range: float = 1.35
@export var attack_damage: float = 8.0
@export var attack_cooldown: float = 1.25

var _spawn_position: Vector3
var _time: float = 0.0
var _dead: bool = false
var _corpse_spawned: bool = false
var _essence_granted: bool = false
var _last_damage_source: Node
var _attack_cooldown_timer: float = 0.0
var _alive_material: Material

@onready var _health_component: Node = $HealthComponent
@onready var _body: MeshInstance3D = $Body
@onready var _collision_shape: CollisionShape3D = $CollisionShape3D
@onready var _hurtbox: Area3D = $Hurtbox3D


func _ready() -> void:
	add_to_group("enemy")
	_health_component.set("max_health", max_health)
	_health_component.set("current_health", max_health)
	if _health_component.has_signal("damaged"):
		_health_component.connect("damaged", Callable(self, "_on_damaged"))
	if _health_component.has_signal("died"):
		_health_component.connect("died", Callable(self, "_on_died"))
	_alive_material = _body.get_active_material(0)
	_spawn_position = global_position


func _physics_process(delta: float) -> void:
	if _dead:
		return

	_attack_cooldown_timer = maxf(_attack_cooldown_timer - delta, 0.0)

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	var attack_target := _find_attack_target()
	if attack_target != null:
		var distance := _flat_distance_to(attack_target.global_position)
		if distance <= attack_range:
			_apply_horizontal_velocity(Vector3.ZERO, delta)
			_attack_target(attack_target)
			move_and_slide()
			return

		_move_toward_position(attack_target.global_position, delta)
		move_and_slide()
		return

	_time += delta
	var offset := Vector3(cos(_time) * patrol_radius, 0.0, sin(_time) * patrol_radius)
	var target := _spawn_position + offset
	var direction := global_position.direction_to(target)
	velocity.x = direction.x * patrol_speed
	velocity.z = direction.z * patrol_speed
	move_and_slide()


func receive_damage(amount: float, source: Node = null) -> void:
	if _dead:
		return

	_last_damage_source = source
	if _health_component.has_method("take_damage"):
		_health_component.call("take_damage", amount, source)


func is_dead() -> bool:
	return _dead


func _on_damaged(amount: float, source: Node) -> void:
	print("EnemyDummy3D received %.1f damage. Health: %.1f/%.1f" % [
		amount,
		_health_component.get("current_health"),
		_health_component.get("max_health"),
	])
	_flash_damage()


func _on_died(source: Node) -> void:
	_die(source)


func _die(source: Node = null) -> void:
	if _dead:
		return

	_dead = true
	remove_from_group("enemy")
	set_physics_process(false)
	velocity = Vector3.ZERO
	collision_layer = 0
	collision_mask = 0
	_collision_shape.set_deferred("disabled", true)
	if _hurtbox.has_method("set_hurtbox_enabled"):
		_hurtbox.call("set_hurtbox_enabled", false)

	var corpse_material := StandardMaterial3D.new()
	corpse_material.albedo_color = Color(0.08, 0.08, 0.08, 1.0)
	corpse_material.roughness = 0.95
	_body.set_surface_override_material(0, corpse_material)

	print("EnemyDummy died")
	_grant_essence(source if source != null else _last_damage_source)
	_spawn_corpse()
	hide()


func _grant_essence(source: Node) -> void:
	if _essence_granted:
		return

	var player := _find_reward_player(source)
	if player == null:
		return

	var essence_component := player.get_node_or_null("EssenceComponent")
	if essence_component != null and essence_component.has_method("add_essence"):
		_essence_granted = true
		essence_component.call("add_essence", essence_reward)


func _spawn_corpse() -> void:
	if _corpse_spawned or corpse_scene == null:
		return

	_corpse_spawned = true
	var corpse := corpse_scene.instantiate() as Node3D
	if corpse == null:
		return

	var spawn_parent := get_parent()
	if spawn_parent == null:
		spawn_parent = get_tree().current_scene
	spawn_parent.add_child(corpse)
	corpse.global_position = global_position
	print("Corpse spawned")


func _flash_damage() -> void:
	if _dead or _body == null:
		return

	var flash_material := StandardMaterial3D.new()
	flash_material.albedo_color = Color(1.0, 0.25, 0.2, 1.0)
	_body.set_surface_override_material(0, flash_material)

	var tween := create_tween()
	tween.tween_interval(0.08)
	tween.tween_callback(_restore_alive_material)


func _restore_alive_material() -> void:
	if not _dead and _body != null:
		_body.set_surface_override_material(0, _alive_material)


func _find_attack_target() -> Node3D:
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
		if health_component != null and health_component.has_method("take_damage"):
			health_component.call("take_damage", attack_damage, self)


func _move_toward_position(target_position: Vector3, delta: float) -> void:
	var to_target := target_position - global_position
	to_target.y = 0.0
	if to_target.length_squared() <= 0.001:
		_apply_horizontal_velocity(Vector3.ZERO, delta)
		return

	var direction := to_target.normalized()
	rotation.y = lerp_angle(rotation.y, atan2(-direction.x, -direction.z), 10.0 * delta)
	_apply_horizontal_velocity(direction * patrol_speed, delta)


func _apply_horizontal_velocity(target_velocity: Vector3, delta: float) -> void:
	velocity.x = move_toward(velocity.x, target_velocity.x, patrol_speed * 8.0 * delta)
	velocity.z = move_toward(velocity.z, target_velocity.z, patrol_speed * 8.0 * delta)


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
