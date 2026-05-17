extends Node3D
class_name SpawnPoint3D

@export var is_active: bool = true

func _ready() -> void:
	add_to_group("spawn_point")
