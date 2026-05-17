extends Node3D

@export var target_path: NodePath
@export var distance: float = 6.5
@export var height: float = 2.1
@export var follow_smoothing: float = 10.0
@export var mouse_sensitivity: float = 0.003
@export var min_pitch_degrees: float = -35.0
@export var max_pitch_degrees: float = 55.0

var target: Node3D
var _yaw: float = 0.0
var _pitch: float = deg_to_rad(18.0)

@onready var camera: Camera3D = $Camera3D


func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	_resolve_target()
	if target != null:
		global_position = target.global_position + Vector3.UP * height

	# TODO G2/G3: lock-on simples em alvo inimigo.


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		_yaw -= event.relative.x * mouse_sensitivity
		_pitch -= event.relative.y * mouse_sensitivity
		_pitch = clampf(_pitch, deg_to_rad(min_pitch_degrees), deg_to_rad(max_pitch_degrees))

	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_ESCAPE:
		if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		else:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _process(delta: float) -> void:
	if target == null or not is_instance_valid(target):
		_resolve_target()
		if target == null:
			return

	var desired_position := target.global_position + Vector3.UP * height
	var weight := 1.0 - exp(-follow_smoothing * delta)
	global_position = global_position.lerp(desired_position, weight)

	rotation = Vector3(_pitch, _yaw, 0.0)
	camera.position = Vector3(0.0, 0.0, distance)
	camera.look_at(global_position, Vector3.UP)


func _resolve_target() -> void:
	if target_path != NodePath():
		target = get_node_or_null(target_path) as Node3D
		if target != null:
			return

	target = get_tree().get_first_node_in_group("player") as Node3D
