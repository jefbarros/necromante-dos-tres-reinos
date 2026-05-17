extends StaticBody2D

signal health_changed(current: int, maximum: int)
signal defeated

@export var max_health: int = 75

var health: int

@onready var hit_flash: Polygon2D = $HitFlash
@onready var collision_shape: CollisionShape2D = $CollisionShape2D

var _hit_tween: Tween


func _ready() -> void:
	add_to_group("enemies")
	health = max_health
	health_changed.emit(health, max_health)


func take_damage(amount: int) -> void:
	if health <= 0:
		return

	health = max(health - amount, 0)
	health_changed.emit(health, max_health)
	_show_hit_feedback()

	if health == 0:
		collision_shape.set_deferred("disabled", true)
		modulate = Color(0.45, 0.45, 0.45, 0.65)
		defeated.emit()


func _show_hit_feedback() -> void:
	if _hit_tween != null:
		_hit_tween.kill()

	hit_flash.visible = true
	hit_flash.modulate.a = 1.0
	_hit_tween = create_tween()
	_hit_tween.tween_property(hit_flash, "modulate:a", 0.0, 0.28)
	_hit_tween.finished.connect(func() -> void:
		hit_flash.visible = false
		hit_flash.modulate.a = 1.0
	)
