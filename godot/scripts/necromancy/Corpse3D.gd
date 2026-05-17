extends Node3D
class_name Corpse3D

@export var summon_scene: PackedScene = preload("res://scenes/summons/SkeletonServant3D.tscn")
@export var usable: bool = true
@export var corpse_lifetime: float = 60.0

var _consumed: bool = false


func _ready() -> void:
	add_to_group("corpse")
	if corpse_lifetime > 0.0:
		get_tree().create_timer(corpse_lifetime).timeout.connect(_on_lifetime_expired)


func can_raise() -> bool:
	return usable and not _consumed


func consume() -> void:
	if _consumed:
		return

	_consumed = true
	usable = false
	remove_from_group("corpse")
	queue_free()


func get_raise_position() -> Vector3:
	return global_position


func _on_lifetime_expired() -> void:
	if not _consumed:
		queue_free()
