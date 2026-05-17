extends StaticBody2D

signal health_changed(current: int, maximum: int)
signal defeated

@export var max_health: int = 75

var health: int


func _ready() -> void:
	add_to_group("enemies")
	health = max_health
	health_changed.emit(health, max_health)


func take_damage(amount: int) -> void:
	if health <= 0:
		return

	health = max(health - amount, 0)
	health_changed.emit(health, max_health)

	if health == 0:
		defeated.emit()
		queue_free()
