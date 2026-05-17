extends Area3D

@export var xp_reward: int = 75
@export var essence_reward: int = 25
@export var reward_name: String = "Baú de Recompensa"

var _player_in_area: bool = false
var _collected: bool = false

func _ready() -> void:
	add_to_group("dungeon_reward")
	connect("body_entered", Callable(self, "_on_body_entered"))
	connect("body_exited", Callable(self, "_on_body_exited"))

func _process(_delta: float) -> void:
	if not _player_in_area or _collected:
		return
	if Input.is_action_just_pressed("interact"):
		_collect_reward()

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		_player_in_area = true

func _on_body_exited(body: Node) -> void:
	if body.is_in_group("player"):
		_player_in_area = false

func _collect_reward() -> void:
	if _collected:
		return
	var player: Node = get_tree().get_first_node_in_group("player")
	if player == null:
		return
	var xp_component := player.get_node_or_null("ExperienceComponent")
	if xp_component != null and xp_component.has_method("add_xp"):
		xp_component.call("add_xp", xp_reward)
	var essence_component := player.get_node_or_null("EssenceComponent")
	if essence_component != null and essence_component.has_method("add_essence"):
		essence_component.call("add_essence", essence_reward)
	_collected = true
	print("Dungeon reward collected")

	# Update quest
	var quest_mgr: Node = get_tree().get_first_node_in_group("quest_manager")
	if quest_mgr != null and quest_mgr.has_method("advance_to"):
		quest_mgr.call("advance_to", 6)  # COLLECT_REWARD

	if has_node("MeshInstance3D"):
		$MeshInstance3D.visible = false
	if has_node("Label3D"):
		$Label3D.text = "Baú vazio"
