extends Node

const SAVE_PATH: String = "user://n3r_prototype_save.json"

func save_game(data: Dictionary) -> bool:
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		print("Failed to open save file")
		return false
	file.store_string(to_json(data))
	file.close()
	print("Prototype save written")
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
	print("Prototype save loaded")
	return parse.result

func has_save() -> bool:
	return FileAccess.file_exists(SAVE_PATH)

func clear_save() -> void:
	if has_save():
		FileAccess.remove(SAVE_PATH)
		print("Prototype save cleared")
