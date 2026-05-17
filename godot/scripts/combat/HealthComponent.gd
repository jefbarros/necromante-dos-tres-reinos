extends Node
class_name HealthComponent

signal damaged(amount: float, source: Node)
signal died(source: Node)

@export var max_health: float = 100.0

var current_health: float
var _dead: bool = false


func _ready() -> void:
	current_health = max_health


func take_damage(amount: float, source: Node = null) -> void:
	if _dead or amount <= 0.0:
		return

	current_health = maxf(current_health - amount, 0.0)
	damaged.emit(amount, source)

	if current_health <= 0.0:
		_dead = true
		died.emit(source)


func heal(amount: float) -> void:
	if amount <= 0.0 or _dead:
		return

	current_health = minf(current_health + amount, max_health)


func is_dead() -> bool:
	return _dead
