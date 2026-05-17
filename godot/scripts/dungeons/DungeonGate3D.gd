extends Node3D

var _is_open: bool = false

@onready var _body: StaticBody3D = $StaticBody3D
@onready var _mesh: MeshInstance3D = $StaticBody3D/MeshInstance3D
@onready var _collision: CollisionShape3D = $StaticBody3D/CollisionShape3D

func _ready() -> void:
	close_gate()

func open_gate() -> void:
	if _is_open:
		return
	_is_open = true
	if _mesh != null:
		_mesh.visible = false
	if _collision != null:
		_collision.disabled = true
	print("Dungeon gate opened")

func close_gate() -> void:
	_is_open = false
	if _mesh != null:
		_mesh.visible = true
	if _collision != null:
		_collision.disabled = false
