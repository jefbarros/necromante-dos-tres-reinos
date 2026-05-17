extends Node
class_name ExperienceComponent

signal xp_changed(current_xp: int, xp_to_next_level: int)
signal level_changed(level: int)

@export var starting_level: int = 1
@export var current_xp: int = 0
@export var xp_to_next_level: int = 100
@export var xp_growth: float = 1.25

var current_level: int = 1

func _ready() -> void:
	current_level = starting_level
	emit_signal("xp_changed", current_xp, xp_to_next_level)
	emit_signal("level_changed", current_level)

func add_xp(amount: int) -> void:
	if amount <= 0:
		return
	
	current_xp += amount
	print("XP gained: %d. Total: %d/%d" % [amount, current_xp, xp_to_next_level])
	
	while current_xp >= xp_to_next_level:
		level_up()
	
	emit_signal("xp_changed", current_xp, xp_to_next_level)

func level_up() -> void:
	current_xp -= xp_to_next_level
	current_level += 1
	xp_to_next_level = int(float(xp_to_next_level) * xp_growth)
	
	print("Level up: %d" % current_level)
	emit_signal("level_changed", current_level)

func get_level() -> int:
	return current_level

func get_xp_progress() -> float:
	if xp_to_next_level == 0:
		return 0.0
	return float(current_xp) / float(xp_to_next_level)
