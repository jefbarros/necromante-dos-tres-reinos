extends Control
class_name SettingsMenu

signal closed

const SETTINGS_PATH := "user://n3r_settings.json"

@onready var _mouse_sensitivity_slider: HSlider = $VBoxContainer/MarginContainer/VBoxContainer/MouseSensitivitySlider
@onready var _mouse_sensitivity_value: Label = $VBoxContainer/MarginContainer/VBoxContainer/MouseSensitivityValue
@onready var _master_volume_slider: HSlider = $VBoxContainer/MarginContainer/VBoxContainer/MasterVolumeSlider
@onready var _master_volume_value: Label = $VBoxContainer/MarginContainer/VBoxContainer/MasterVolumeValue
@onready var _quality_option: OptionButton = $VBoxContainer/MarginContainer/VBoxContainer/QualityOption
@onready var _fullscreen_check: CheckButton = $VBoxContainer/MarginContainer/VBoxContainer/FullscreenCheck
@onready var _back_button: Button = $VBoxContainer/MarginContainer/VBoxContainer/BackButton

var _settings: Dictionary = {
	"mouse_sensitivity": 0.5,
	"master_volume": 1.0,
	"quality": 1,  # 0=low, 1=medium, 2=high
	"fullscreen": false
}


func _ready() -> void:
	_load_settings()
	_apply_settings_to_ui()
	
	_mouse_sensitivity_slider.value_changed.connect(_on_sensitivity_changed)
	_master_volume_slider.value_changed.connect(_on_volume_changed)
	_quality_option.item_selected.connect(_on_quality_selected)
	_fullscreen_check.toggled.connect(_on_fullscreen_toggled)
	_back_button.pressed.connect(_on_back_pressed)


func _load_settings() -> void:
	if not FileAccess.file_exists(SETTINGS_PATH):
		return
	
	var file := FileAccess.open(SETTINGS_PATH, FileAccess.READ)
	if file == null:
		return
	
	var content := file.get_as_text()
	file.close()
	
	var parse := JSON.parse_string(content)
	if parse.error != OK or typeof(parse.result) != TYPE_DICTIONARY:
		return
	
	_settings = parse.result


func _save_settings() -> void:
	var file := FileAccess.open(SETTINGS_PATH, FileAccess.WRITE)
	if file == null:
		print("Failed to save settings")
		return
	
	file.store_string(to_json(_settings))
	file.close()
	print("Settings saved")


func _apply_settings_to_ui() -> void:
	_mouse_sensitivity_slider.value = _settings.get("mouse_sensitivity", 0.5)
	_master_volume_slider.value = _settings.get("master_volume", 1.0)
	_quality_option.selected = _settings.get("quality", 1)
	_fullscreen_check.button_pressed = _settings.get("fullscreen", false)
	
	_update_labels()


func _update_labels() -> void:
	_mouse_sensitivity_value.text = "%.2f" % _settings.get("mouse_sensitivity", 0.5)
	_master_volume_value.text = "%d%%" % int(_settings.get("master_volume", 1.0) * 100)


func _on_sensitivity_changed(value: float) -> void:
	_settings["mouse_sensitivity"] = value
	_update_labels()
	_save_settings()


func _on_volume_changed(value: float) -> void:
	_settings["master_volume"] = value
	_update_labels()
	_save_settings()
	AudioServer.set_bus_volume_db(
		AudioServer.get_bus_index("Master"),
		linear_to_db(value)
	)


func _on_quality_selected(index: int) -> void:
	_settings["quality"] = index
	_save_settings()
	_apply_quality_preset(index)


func _apply_quality_preset(index: int) -> void:
	match index:
		0:  # Low
			RenderingServer.set_default_clear_color(Color(0.05, 0.05, 0.08))
		1:  # Medium
			RenderingServer.set_default_clear_color(Color(0.08, 0.08, 0.1))
		2:  # High
			RenderingServer.set_default_clear_color(Color(0.1, 0.1, 0.12))


func _on_fullscreen_toggled(toggled_on: bool) -> void:
	_settings["fullscreen"] = toggled_on
	_save_settings()
	
	if toggled_on:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
	else:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)


func _on_back_pressed() -> void:
	emit_signal("closed")
	queue_free()
