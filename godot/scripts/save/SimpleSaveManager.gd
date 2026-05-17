extends Node

const SAVE_PATH: String = "user://n3r_prototype_save.json"
const SAVE_VERSION: int = 1
const MIN_SUPPORTED_SAVE_VERSION: int = 1


func _ready() -> void:
	add_to_group("save_manager")


func save_game(additional_data: Dictionary = {}) -> bool:
	var data: Dictionary = _create_save_data(additional_data)

	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_error("Failed to open save file. Error: %s" % FileAccess.get_open_error())
		return false

	file.store_string(JSON.stringify(data, "\t"))
	file.close()

	print("Prototype save written, version: %d" % SAVE_VERSION)
	return true


func load_game() -> Dictionary:
	var data := _read_save_data()

	if data.is_empty():
		return {}

	print("Prototype save loaded, version: %d" % int(data.get("save_version", 0)))
	return data


func has_save() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false

	var data := _read_save_data()

	if data.is_empty():
		return false

	return int(data.get("save_version", 0)) >= MIN_SUPPORTED_SAVE_VERSION


func clear_save() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return true

	var error := DirAccess.remove_absolute(SAVE_PATH)

	if error != OK:
		push_error("Failed to remove save file. Error: %s" % error)
		return false

	print("Prototype save cleared")
	return true


func _read_save_data() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}

	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		push_error("Failed to open save file. Error: %s" % FileAccess.get_open_error())
		return {}

	var content := file.get_as_text()
	file.close()

	var json := JSON.new()
	var error := json.parse(content)

	if error != OK:
		push_warning(
			"Failed to parse save data: %s at line %d" %
			[json.get_error_message(), json.get_error_line()]
		)
		return {}

	if typeof(json.data) != TYPE_DICTIONARY:
		push_warning("Save data is not a dictionary")
		return {}

	var data: Dictionary = json.data

	if not _validate_save_data(data):
		push_warning("Save data incomplete or corrupted")
		return {}

	return data


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

	var player: Node = get_tree().get_first_node_in_group("player")
	if player != null:
		var essence := player.get_node_or_null("EssenceComponent")
		if essence != null:
			var current_essence = essence.get("current_essence")
			var max_essence = essence.get("max_essence")

			if current_essence != null:
				data["current_essence"] = current_essence

			if max_essence != null:
				data["max_essence"] = max_essence

		var xp := player.get_node_or_null("ExperienceComponent")
		if xp != null:
			var current_level = xp.get("current_level")
			var current_xp = xp.get("current_xp")

			if current_level != null:
				data["player_level"] = current_level

			if current_xp != null:
				data["player_xp"] = current_xp

		var loot_collected_count = player.get("loot_collected_count")
		if loot_collected_count != null:
			data["total_loot_collected"] = loot_collected_count

	var quest_mgr: Node = get_tree().get_first_node_in_group("quest_manager")
	if quest_mgr != null:
		var current_state = quest_mgr.get("current_state")
		if current_state != null:
			data["main_quest_state"] = current_state

	for key in additional_data.keys():
		data[key] = additional_data[key]

	return data


func _validate_save_data(data: Dictionary) -> bool:
	var required_fields := [
		"save_version",
		"timestamp"
	]

	for field in required_fields:
		if not data.has(field):
			return false

	var save_version := int(data.get("save_version", 0))

	if save_version < MIN_SUPPORTED_SAVE_VERSION:
		return false

	return true


func _get_current_scene_path() -> String:
	var scene := get_tree().current_scene

	if scene != null:
		return scene.scene_file_path

	return ""


func get_fallback_scene() -> String:
	return "res://scenes/hub/Hub_VeyrholdOutskirts.tscn"
