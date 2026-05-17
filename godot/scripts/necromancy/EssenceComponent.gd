extends Node
class_name EssenceComponent

signal essence_changed(current: int, max: int)

@export var max_essence: int = 100
@export var starting_essence: int = 20

var current_essence: int = 0


func _ready() -> void:
	current_essence = clampi(starting_essence, 0, max_essence)
	essence_changed.emit(current_essence, max_essence)


func add_essence(amount: int) -> void:
	if amount <= 0:
		return

	var previous := current_essence
	current_essence = clampi(current_essence + amount, 0, max_essence)
	if current_essence != previous:
		print("Essence gained: %d" % (current_essence - previous))
		essence_changed.emit(current_essence, max_essence)


func can_spend(amount: int) -> bool:
	return amount >= 0 and current_essence >= amount


func spend_essence(amount: int) -> bool:
	if amount < 0:
		return false

	if not can_spend(amount):
		print("Not enough essence")
		return false

	current_essence = clampi(current_essence - amount, 0, max_essence)
	print("Essence spent: %d" % amount)
	essence_changed.emit(current_essence, max_essence)
	return true
