extends Node3D

signal room_started(room_index)
signal room_cleared(room_index)
signal dungeon_cleared()

@export var dungeon_name: String = "Cripta de Veyrfall"
@export var reward_chest_scene: PackedScene = preload("res://scenes/loot/DungeonRewardChest3D.tscn")
@export var save_manager_script: Script = preload("res://scripts/save/SimpleSaveManager.gd")

var current_room: int = 0
var enemies_alive: int = 0
var dungeon_cleared: bool = false
var dungeon_hint: String = ""
var current_room_name: String = "Nenhuma"

onready var _room_nodes: Array[Node3D] = [get_node("Rooms/Room1"), get_node("Rooms/Room2"), get_node("Rooms/Room3")]
onready var _gates: Array[Node] = [get_node("Gates/Gate1"), get_node("Gates/Gate2")]
onready var _reward_spawn: Node3D = get_node("RewardSpawn")

func _ready() -> void:
	add_to_group("dungeon_manager")
	_start_dungeon()

func _process(_delta: float) -> void:
	if dungeon_cleared:
		return
	_update_room_status()

func _start_dungeon() -> void:
	current_room = 1
	current_room_name = "Sala 1"
	dungeon_hint = "Elimine todos os inimigos"
	print("Dungeon started")
	_emit_room_started(current_room)
	_update_gate_states()

func _update_room_status() -> void:
	var alive := _count_alive_enemies(current_room)
	if enemies_alive != alive:
		enemies_alive = alive
	if alive == 0 and current_room > 0 and current_room <= 3:
		if not _is_room_cleared(current_room):
			_clear_current_room()

func _count_alive_enemies(room_index: int) -> int:
	var room := _room_nodes[clamp(room_index - 1, 0, _room_nodes.size() - 1)]
	if room == null:
		return 0
	var count := 0
	for enemy in room.get_children():
		if enemy.is_in_group("enemy") and _enemy_is_alive(enemy):
			count += 1
		for child in enemy.get_children():
			if child.is_in_group("enemy") and _enemy_is_alive(child):
				count += 1
	return count

func _enemy_is_alive(enemy: Node) -> bool:
	if enemy == null or not enemy.is_inside_tree():
		return false
	if enemy.has_method("is_dead"):
		return not bool(enemy.call("is_dead"))
	return true

func _is_room_cleared(room_index: int) -> bool:
	return _get_room_state(room_index) == "CLEARED"

func _get_room_state(room_index: int) -> String:
	return str("CLEARED") if _count_alive_enemies(room_index) == 0 else str("ACTIVE")

func _clear_current_room() -> void:
	print("Room %d cleared" % current_room)
	emit_signal("room_cleared", current_room)
	_update_quest_on_room_clear()
	match current_room:
		1:
			_gates[0].call("open_gate")
			current_room = 2
			current_room_name = "Sala 2"
			dungeon_hint = "Elimine todos os inimigos"
			_emit_room_started(current_room)
			_update_gate_states()
		2:
			_gates[1].call("open_gate")
			current_room = 3
			current_room_name = "Sala 3"
			dungeon_hint = "Derrote Ravan, Lâmina da Chama Branca"
			_emit_room_started(current_room)
			_update_gate_states()
		3:
			dungeon_cleared = true
			current_room_name = "Concluída"
			dungeon_hint = "Dungeon concluída"
			print("Dungeon cleared")
			emit_signal("dungeon_cleared")
			_spawn_reward()
			_save_progress()

func _emit_room_started(room_index: int) -> void:
	emit_signal("room_started", room_index)
	print("Room %d started" % room_index)

func _update_gate_states() -> void:
	if current_room <= 1:
		_gates[0].call("close_gate")
		_gates[1].call("close_gate")
	elif current_room == 2:
		_gates[0].call("open_gate")
		_gates[1].call("close_gate")
	elif current_room == 3:
		_gates[0].call("open_gate")
		_gates[1].call("open_gate")

func _spawn_reward() -> void:
	if reward_chest_scene == null or _reward_spawn == null:
		return
	var reward = reward_chest_scene.instantiate()
	if reward == null:
		return
	_reward_spawn.add_child(reward)
	reward.global_position = _reward_spawn.global_position
	print("Dungeon reward spawned")


func _update_quest_on_room_clear() -> void:
	var quest_mgr := get_tree().get_first_node_in_group("quest_manager")
	if quest_mgr == null or not quest_mgr.has_method("advance_if_current"):
		return
	match current_room:
		1:
			quest_mgr.call("advance_if_current", 2)  # CLEAR_ROOM_1
		2:
			quest_mgr.call("advance_if_current", 4)  # CLEAR_ROOM_2

func _save_progress() -> void:
	var save_manager = save_manager_script.new()
	var player := get_tree().get_first_node_in_group("player")
	var quest_mgr := get_tree().get_first_node_in_group("quest_manager")
	var scene_path := ""
	if get_tree().current_scene != null and get_tree().current_scene.has_method("get_filename"):
		scene_path = String(get_tree().current_scene.call("get_filename"))
	var data := {
		"player_level": 0,
		"player_xp": 0,
		"current_essence": 0,
		"main_quest_state": 0,
		"vertical_slice_completed": false,
		"boss_ravan_defeated": false,
		"crypt_veyrfall_cleared": true,
		"last_scene": scene_path
	}
	if player != null:
		var xp := player.get_node_or_null("ExperienceComponent")
		if xp != null:
			data["player_level"] = int(xp.get("current_level"))
			data["player_xp"] = int(xp.get("current_xp"))
		var essence := player.get_node_or_null("EssenceComponent")
		if essence != null and essence.has_method("get_current_essence"):
			data["current_essence"] = int(essence.call("get_current_essence"))
		elif essence != null and essence.has("current_essence"):
			data["current_essence"] = int(essence.get("current_essence"))
	if quest_mgr != null and quest_mgr.has("current_state"):
		data["main_quest_state"] = int(quest_mgr.get("current_state"))
		data["vertical_slice_completed"] = bool(quest_mgr.get("current_state") == 8)
		data["boss_ravan_defeated"] = bool(quest_mgr.get("current_state") >= 5)
	if save_manager != null and save_manager.has_method("save_game"):
		save_manager.call("save_game", data)
