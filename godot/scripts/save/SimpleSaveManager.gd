extends Node
class_name SimpleSaveManager

const SAVE_PATH: String = "user://n3r_prototype_save.json"
const SAVE_VERSION: int = 1

func _ready() -> void:
	add_to_group("save_manager")


func save_game(additional_data: Dictionary = {}) -> bool:
	var data := _create_save_data(additional_data)
	
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		print("Failed to open save file")
		return false
	
	file.store_string(to_json(data))
	file.close()
	print("Prototype save written, version: %d" % SAVE_VERSION)
	return true


func load_game() -> Dictionary:
	if not has_save():
		return {}
	
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return {}
	
	var content := file.get_as_text()
	file.close()
	
	var parse := JSON.parse_string(content)
	if parse.error != OK:
		print("Failed to parse save data: %s" % parse.error_string)
		return {}
	
	if typeof(parse.result) != TYPE_DICTIONARY:
		return {}
	
	var data: Dictionary = parse.result
	
	# Validate minimum required fields
	if not _validate_save_data(data):
		print("Save data incomplete or corrupted, returning empty")
		return {}
	
	print("Prototype save loaded, version: %d" % data.get("save_version", 0))
	return data


func has_save() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	
	# Quick validation - try to load and check version
	var test_data := load_game()
	return test_data.get("save_version", 0) >= 1


func clear_save() -> void:
	if has_save():
		FileAccess.remove(SAVE_PATH)
		print("Prototype save cleared")


func _create_save_data(additional_data: Dictionary = {}) -> Dictionary:
	var data := {
		"save_version": SAVE_VERSION,
		"timestamp": Time.get_unix_time_from_system(),
		"last_scene": _get_current_scene_path(),
		"player_level": 1,
		"player_xp": 0,
		"current_essence": 50,
		"max_essence": 100,
		"total_loot_collected": 0,
		"main_quest_state": 0,
		"vertical_slice_completed": false,
		"boss_ravan_defeated": false,
		"crypt_veyrfall_cleared": false
	}
	
	# Get player data if available
	var player := get_tree().get_first_node_in_group("player")
	if player != null:
		var essence := player.get_node_or_null("EssenceComponent")
		if essence != null:
			data["current_essence"] = essence.get("current_essence")
			data["max_essence"] = essence.get("max_essence")
		
		var xp := player.get_node_or_null("ExperienceComponent")
		if xp != null:
			data["player_level"] = xp.get("current_level")
			data["player_xp"] = xp.get("current_xp")
		
		if player.has("loot_collected_count"):
			data["total_loot_collected"] = player.get("loot_collected_count")
	
	# Get quest state
	var quest_mgr := get_tree().get_first_node_in_group("quest_manager")
	if quest_mgr != null:
		if quest_mgr.has("current_state"):
			data["main_quest_state"] = quest_mgr.get("current_state")
	
	# Merge additional data
	for key in additional_data:
		data[key] = additional_data[key]
	
	return data


func _validate_save_data(data: Dictionary) -> bool:
	# Minimum required fields for valid save
	var required_fields := ["save_version", "timestamp"]
	
	for field in required_fields:
		if not data.has(field):
			return false
	
	return true


func _get_current_scene_path() -> String:
	var scene := get_tree().current_scene
	if scene != null:
		return scene.scene_file_path
	return ""


func get_fallback_scene() -> String:
	return "res://scenes/hub/Hub_VeyrholdOutskirts.tscn"
