extends Area3D
class_name AreaTransition3D

## AreaTransition3D
## Handles player travel between areas

@export var target_scene: PackedScene
@export var target_spawn_point: String = ""
@export var transition_label: String = "E: Viajar"
@export var area_name: String = "Area"

@onready var _interaction_label: Label3D = $Label3D

var _player_in_area: bool = false


func _ready() -> void:
	add_to_group("area_transition")
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)
	
	if _interaction_label != null:
		_interaction_label.text = transition_label
		_interaction_label.visible = false


func _process(_delta: float) -> void:
	if _player_in_area:
		if Input.is_action_just_pressed("interact"):
			_transition_to_area()


func _on_body_entered(body: Node3D) -> void:
	if body.is_in_group("player"):
		_player_in_area = true
		_show_label()


func _on_body_exited(body: Node3D) -> void:
	if body.is_in_group("player"):
		_player_in_area = false
		_hide_label()


func _show_label() -> void:
	if _interaction_label != null:
		_interaction_label.visible = true


func _hide_label() -> void:
	if _interaction_label != null:
		_interaction_label.visible = false


func _transition_to_area() -> void:
	if target_scene == null:
		print("AreaTransition: No target scene set")
		return

	print("AreaTransition: Transitioning to ", area_name)
	
	var scene_manager = get_tree().get_first_node_in_group("scene_manager")
	if scene_manager != null and scene_manager.has_method("transition_to"):
		scene_manager.call("transition_to", target_scene, target_spawn_point)
		return

	# Fallback: direct scene change
	get_tree().change_scene_to_packed(target_scene)
