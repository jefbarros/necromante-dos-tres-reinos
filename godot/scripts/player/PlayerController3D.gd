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

var _last_move_direction: Vector3 = Vector3.FORWARD
var _dodge_timer: float = 0.0
var _dodge_cooldown_timer: float = 0.0


func _ready() -> void:
	add_to_group("player")
	_ensure_input_actions()
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_ESCAPE:
		if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		else:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _physics_process(delta: float) -> void:
	_dodge_cooldown_timer = maxf(_dodge_cooldown_timer - delta, 0.0)

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

	if _dodge_timer > 0.0:
		_dodge_timer -= delta
	else:
		var target_speed := sprint_speed if Input.is_action_pressed("sprint") else move_speed
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


func _add_key_action(action_name: StringName, keycode: Key) -> void:
	if not InputMap.has_action(action_name):
		InputMap.add_action(action_name)

	for event in InputMap.action_get_events(action_name):
		if event is InputEventKey and event.keycode == keycode:
			return

	var key_event := InputEventKey.new()
	key_event.keycode = keycode
	InputMap.action_add_event(action_name, key_event)
