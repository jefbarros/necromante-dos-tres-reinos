extends Node3D
class_name NPCInteractable3D

## Base class for interactable NPCs like quest givers

@export var npc_name: String = "NPC"
@export var interaction_hint: String = "E: falar"
@export var dialogue_text: String = "..."
@export var quest_manager_path: NodePath = NodePath("../QuestManager3D")

var _player_in_area: bool = false
var _interact_label: Label3D
var _quest_manager: Node = null


func _ready() -> void:
	add_to_group("npc_interactable")
	_interact_label = $InteractLabel if has_node("InteractLabel") else null
	if _interact_label != null:
		_interact_label.text = interaction_hint
		_interact_label.visible = false
	
	$Area3D.connect("body_entered", Callable(self, "_on_body_entered"))
	$Area3D.connect("body_exited", Callable(self, "_on_body_exited"))
	
	if quest_manager_path != NodePath(""):
		_quest_manager = get_node_or_null(quest_manager_path)


func _process(_delta: float) -> void:
	if _player_in_area:
		if _interact_label != null:
			_interact_label.visible = true
		if Input.is_action_just_pressed("interact"):
			_on_interact()
	else:
		if _interact_label != null:
			_interact_label.visible = false


func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		_player_in_area = true


func _on_body_exited(body: Node) -> void:
	if body == get_tree().get_first_node_in_group("player"):
		_player_in_area = false


func _on_interact() -> void:
	print("[%s] %s" % [npc_name, dialogue_text])
	_try_start_quest()


func _try_start_quest() -> void:
	if _quest_manager == null:
		_quest_manager = get_tree().get_first_node_in_group("quest_manager")
	if _quest_manager != null and _quest_manager.has_method("start_main_quest"):
		_quest_manager.call("start_main_quest")
	print("Quest started from NPC: %s" % npc_name)
