extends Area3D

@export var target_scene: PackedScene
@export var hint_text: String = "Pressione E para entrar"

var _player_in_area: bool = false
var _hint_label: Label3D

func _ready() -> void:
	_hint_label = $Label3D if has_node("Label3D") else null
	if _hint_label != null:
		_hint_label.text = hint_text
	connect("body_entered", Callable(self, "_on_body_entered"))
	connect("body_exited", Callable(self, "_on_body_exited"))

func _process(_delta: float) -> void:
	if not _player_in_area:
		return
	if Input.is_action_just_pressed("interact") and target_scene != null:
		print("Arena portal triggered")
		get_tree().change_scene_to_file(target_scene.resource_path)

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		_player_in_area = true
		if _hint_label != null:
			_hint_label.text = hint_text

func _on_body_exited(body: Node) -> void:
	if body.is_in_group("player"):
		_player_in_area = false
		if _hint_label != null:
			_hint_label.text = hint_text
