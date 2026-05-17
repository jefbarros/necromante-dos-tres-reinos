extends Control
class_name MainMenu

const HUB_SCENE := preload("res://scenes/hub/Hub_VeyrholdOutskirts.tscn")

@onready var _new_game_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/NewGameButton
@onready var _continue_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/ContinueButton
@onready var _settings_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/SettingsButton
@onready var _quit_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/QuitButton

var _settings_menu: Control = null


func _ready() -> void:
	_new_game_button.pressed.connect(_on_new_game_pressed)
	_continue_button.pressed.connect(_on_continue_pressed)
	_settings_button.pressed.connect(_on_settings_pressed)
	_quit_button.pressed.connect(_on_quit_pressed)
	
	_update_continue_button_state()


func _update_continue_button_state() -> void:
	var has_save := SimpleSaveManager.has_save()
	_continue_button.disabled = not has_save
	if has_save:
		_continue_button.text = "Continuar"
	else:
		_continue_button.text = "Continuar (Sem Save)"


func _on_new_game_pressed() -> void:
	# Clear existing save for fresh start
	SimpleSaveManager.clear_save()
	
	_load_hub()


func _on_continue_pressed() -> void:
	# Just load hub - save loading will be handled by hub's resume logic
	_load_hub()


func _load_hub() -> void:
	get_tree().change_scene_to_packed(HUB_SCENE)


func _on_settings_pressed() -> void:
	_open_settings_menu()


func _open_settings_menu() -> void:
	if _settings_menu == null:
		var settings_scene := load("res://scenes/ui/SettingsMenu.tscn")
		if settings_scene == null:
			print("SettingsMenu.tscn not found, skipping settings")
			return
		_settings_menu = settings_scene.instantiate()
	
	add_child(_settings_menu)
	_settings_menu.closed.connect(_on_settings_closed)


func _on_settings_closed() -> void:
	if _settings_menu != null and is_instance_valid(_settings_menu):
		_settings_menu.queue_free()
		_settings_menu = null


func _on_quit_pressed() -> void:
	get_tree().quit()
