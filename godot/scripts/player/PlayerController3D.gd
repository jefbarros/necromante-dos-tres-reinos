extends CharacterBody3D

@export var move_speed: float = 5.0
@export var sprint_speed: float = 8.0
@export var acceleration: float = 18.0
@export var deceleration: float = 22.0
@export var dodge_force: float = 12.0
@export var gravity: float = 24.0
@export var rotation_speed: float = 12.0
@export var dodge_duration: float = 0.18
@export var dodge_cooldown: float = 0.55
@export var attack_damage: float = 18.0
@export var attack_cooldown: float = 0.45
@export var attack_duration: float = 0.16
@export var attack_range: float = 1.25
@export var attack_move_multiplier: float = 0.45

var _last_move_direction: Vector3 = Vector3.FORWARD
var _dodge_timer: float = 0.0
var _dodge_cooldown_timer: float = 0.0
var _attack_timer: float = 0.0
var _attack_cooldown_timer: float = 0.0

@onready var _attack_hitbox: Node3D = get_node_or_null("BasicAttackHitbox") as Node3D
@onready var _raise_skeleton_skill: Node = get_node_or_null("RaiseSkeletonSkill")


func _ready() -> void:
	add_to_group("player")
	_ensure_input_actions()
	if _attack_hitbox != null:
		_attack_hitbox.set("damage", attack_damage)
		_attack_hitbox.position.z = -attack_range * 0.5
		var attack_shape := _attack_hitbox.get_node_or_null("CollisionShape3D") as CollisionShape3D
		var box_shape := attack_shape.shape as BoxShape3D if attack_shape != null else null
		if box_shape != null:
			var shape_size := box_shape.size
			shape_size.z = attack_range
			box_shape.size = shape_size
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_ESCAPE:
		if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		else:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _physics_process(delta: float) -> void:
	_dodge_cooldown_timer = maxf(_dodge_cooldown_timer - delta, 0.0)
	_attack_cooldown_timer = maxf(_attack_cooldown_timer - delta, 0.0)
	_update_attack_timer(delta)

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	var input_vector := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	var move_direction := _get_camera_relative_direction(input_vector)

	if move_direction.length_squared() > 0.001:
		_last_move_direction = move_direction
		rotation.y = lerp_angle(rotation.y, atan2(-move_direction.x, -move_direction.z), rotation_speed * delta)

	if Input.is_action_just_pressed("dodge") and _dodge_cooldown_timer <= 0.0:
		_start_dodge(move_direction)

	if Input.is_action_just_pressed("attack_primary"):
		_start_basic_attack()

	if Input.is_action_just_pressed("raise_skeleton"):
		_try_raise_skeleton()

	if _dodge_timer > 0.0:
		_dodge_timer -= delta
	else:
		var target_speed := sprint_speed if Input.is_action_pressed("sprint") else move_speed
		if _attack_timer > 0.0:
			target_speed *= attack_move_multiplier
		var target_velocity := move_direction * target_speed
		var rate := acceleration if move_direction.length_squared() > 0.001 else deceleration
		velocity.x = move_toward(velocity.x, target_velocity.x, rate * delta)
		velocity.z = move_toward(velocity.z, target_velocity.z, rate * delta)

	move_and_slide()


func _start_dodge(move_direction: Vector3) -> void:
	var dodge_direction := move_direction
	if dodge_direction.length_squared() <= 0.001:
		dodge_direction = _last_move_direction

	velocity.x = dodge_direction.x * dodge_force
	velocity.z = dodge_direction.z * dodge_force
	_dodge_timer = dodge_duration
	_dodge_cooldown_timer = dodge_cooldown


func _start_basic_attack() -> void:
	if _attack_cooldown_timer > 0.0:
		return

	print("Player basic attack")
	_attack_timer = attack_duration
	_attack_cooldown_timer = attack_cooldown

	if _attack_hitbox != null:
		_attack_hitbox.set("damage", attack_damage)
		if _attack_hitbox.has_method("set_active"):
			_attack_hitbox.call("set_active", true)


func _update_attack_timer(delta: float) -> void:
	if _attack_timer <= 0.0:
		return

	_attack_timer = maxf(_attack_timer - delta, 0.0)
	if _attack_timer <= 0.0 and _attack_hitbox != null and _attack_hitbox.has_method("set_active"):
		_attack_hitbox.call("set_active", false)


func _try_raise_skeleton() -> void:
	if _raise_skeleton_skill == null or not _raise_skeleton_skill.has_method("try_raise_skeleton"):
		print("No corpse nearby")
		return

	var result := String(_raise_skeleton_skill.call("try_raise_skeleton"))
	match result:
		"raised":
			print("Skeleton raised")
		"limit_reached":
			print("Summon limit reached")
		_:
			print("No corpse nearby")


func _get_camera_relative_direction(input_vector: Vector2) -> Vector3:
	if input_vector == Vector2.ZERO:
		return Vector3.ZERO

	var camera := get_viewport().get_camera_3d()
	var forward := Vector3.FORWARD
	var right := Vector3.RIGHT

	if camera != null:
		forward = -camera.global_transform.basis.z
		right = camera.global_transform.basis.x

	forward.y = 0.0
	right.y = 0.0
	forward = forward.normalized()
	right = right.normalized()

	return (right * input_vector.x + forward * -input_vector.y).normalized()


func _ensure_input_actions() -> void:
	_add_key_action("move_forward", KEY_W)
	_add_key_action("move_back", KEY_S)
	_add_key_action("move_left", KEY_A)
	_add_key_action("move_right", KEY_D)
	_add_key_action("sprint", KEY_SHIFT)
	_add_key_action("dodge", KEY_SPACE)
	_add_key_action("raise_skeleton", KEY_R)
	_add_mouse_button_action("attack_primary", MOUSE_BUTTON_LEFT)


func _add_key_action(action_name: StringName, keycode: Key) -> void:
	if not InputMap.has_action(action_name):
		InputMap.add_action(action_name)

	for event in InputMap.action_get_events(action_name):
		if event is InputEventKey and event.keycode == keycode:
			return

	var key_event := InputEventKey.new()
	key_event.keycode = keycode
	InputMap.action_add_event(action_name, key_event)


func _add_mouse_button_action(action_name: StringName, button_index: MouseButton) -> void:
	if not InputMap.has_action(action_name):
		InputMap.add_action(action_name)

	for event in InputMap.action_get_events(action_name):
		if event is InputEventMouseButton and event.button_index == button_index:
			return

	var mouse_event := InputEventMouseButton.new()
	mouse_event.button_index = button_index
	InputMap.action_add_event(action_name, mouse_event)
