extends Node3D

@export var target_scene_path: String = ""
@export var hint_text: String = "Pressione E para entrar"
@export var exit_text: String = "Pressione E para retornar"
@export var required_dungeon_cleared: bool = false
@export var dungeon_manager_path: NodePath = NodePath("../DungeonManager3D")

var _player_in_area: bool = false
var _hint_label: Label3D
var _player: Node = null

func _ready() -> void:
	_hint_label = $Label3D if has_node("Label3D") else null
	if _hint_label != null:
		_hint_label.text = hint_text
	$Area3D.connect("body_entered", Callable(self, "_on_body_entered"))
	$Area3D.connect("body_exited", Callable(self, "_on_body_exited"))

func _process(_delta: float) -> void:
	if not _player_in_area:
		return
	if Input.is_action_just_pressed("interact") and _can_enter():
		if not target_scene_path.is_empty():
			print("Dungeon entrance triggered: loading scene")
			get_tree().change_scene_to_file(_normalized_scene_path())

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		_player_in_area = true
		_player = body
		if _hint_label != null:
			_hint_label.text = _current_hint()

func _on_body_exited(body: Node) -> void:
	if body == _player:
		_player_in_area = false
		_player = null
		if _hint_label != null:
			_hint_label.text = hint_text

func _current_hint() -> String:
	if required_dungeon_cleared and not _is_dungeon_cleared():
		return "Complete a dungeon antes de sair"
	return exit_text if required_dungeon_cleared else hint_text

func _can_enter() -> bool:
	if required_dungeon_cleared:
		var manager := _get_dungeon_manager()
		return manager != null and bool(manager.get("is_dungeon_cleared"))
	return true

func _get_dungeon_manager() -> Node:
	if dungeon_manager_path == NodePath(""):
		return null
	return get_node_or_null(dungeon_manager_path)

func _is_dungeon_cleared() -> bool:
	var manager := _get_dungeon_manager()
	if manager == null:
		return false
	return bool(manager.get("is_dungeon_cleared"))


func _normalized_scene_path() -> String:
	if target_scene_path.begins_with("res://"):
		return target_scene_path
	return "res://" + target_scene_path
