extends Control
class_name PauseMenu

const MAIN_MENU_SCENE := preload("res://scenes/ui/MainMenu.tscn")

signal requested_continue
signal requested_save
signal requested_load
signal requested_quit_to_menu
signal requested_quit_to_desktop

@onready var _continue_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/ContinueButton
@onready var _save_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/SaveButton
@onready var _load_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/LoadButton
@onready var _menu_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/MenuButton
@onready var _quit_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/QuitButton


func _ready() -> void:
	_continue_button.pressed.connect(_on_continue_pressed)
	_save_button.pressed.connect(_on_save_pressed)
	_load_button.pressed.connect(_on_load_pressed)
	_menu_button.pressed.connect(_on_menu_pressed)
	_quit_button.pressed.connect(_on_quit_pressed)


func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		_on_continue_pressed()


func _on_continue_pressed() -> void:
	emit_signal("requested_continue")
	queue_free()
	get_tree().paused = false


func _on_save_pressed() -> void:
	# Collect current game state
	var game_state := _collect_game_state()
	var result := SimpleSaveManager.save_game(game_state)
	if result:
		print("Game saved successfully")
	else:
		print("Failed to save game")


func _on_load_pressed() -> void:
	# Load the game using singleton
	var save_data := SimpleSaveManager.load_game()
	if save_data.size() > 0:
		_apply_game_state(save_data)
		print("Game loaded successfully")
	else:
		print("No save data found to load")
	
	emit_signal("requested_load")
	queue_free()
	get_tree().paused = false


func _on_menu_pressed() -> void:
	get_tree().paused = false
	get_tree().change_scene_to_packed(MAIN_MENU_SCENE)


func _on_quit_pressed() -> void:
	get_tree().quit()


func _collect_game_state() -> Dictionary:
	var state := {}
	
	# Get player data
	var player := get_tree().get_first_node_in_group("player")
	if player != null:
		state["player_position"] = {
			"x": player.position.x,
			"y": player.position.y,
			"z": player.position.z
		}
		
		var health := player.get_node_or_null("HealthComponent")
		if health != null:
			state["player_health"] = health.get("current_health")
		
		var essence := player.get_node_or_null("EssenceComponent")
		if essence != null:
			state["player_essence"] = essence.get("current_essence")
		
		var xp := player.get_node_or_null("ExperienceComponent")
		if xp != null:
			state["player_level"] = xp.get("current_level")
			state["player_xp"] = xp.get("current_xp")
	
	# Get current scene
	var current_scene := get_tree().current_scene
	if current_scene != null:
		state["last_scene"] = current_scene.scene_file_path
	
	# Get quest state
	var quest_mgr := get_tree().get_first_node_in_group("quest_manager")
	if quest_mgr != null:
		state["quest_state"] = quest_mgr.get("current_state") if quest_mgr.has("current_state") else 0
		state["quest_objective"] = quest_mgr.get("current_objective") if quest_mgr.has("current_objective") else ""
	
	# Get dungeon state
	var dungeon_mgr := get_tree().get_first_node_in_group("dungeon_manager")
	if dungeon_mgr != null:
		state["dungeon_cleared"] = dungeon_mgr.get("is_cleared") if dungeon_mgr.has("is_cleared") else false
	
	# Get boss state
	var boss := get_tree().get_first_node_in_group("boss_ravan")
	if boss != null:
		state["boss_ravan_defeated"] = boss.get("is_defeated") if boss.has("is_defeated") else false
	
	return state


func _apply_game_state(state: Dictionary) -> void:
	# For MVP, we just log what was loaded
	print("Applying game state: ", state)
	# In a full implementation, this would restore player position, health, etc.
