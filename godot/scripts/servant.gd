extends CharacterBody2D

signal attacked(damage: int)

@export var speed: float = 165.0
@export var attack_damage: int = 14
@export var attack_range: float = 46.0
@export var attack_cooldown: float = 0.7
@export var follow_distance: float = 44.0

var player: Node2D
var active: bool = true

var _attack_timer: float = 0.0
var _pulse_tween: Tween

@onready var slash: Polygon2D = $Slash


func _physics_process(delta: float) -> void:
	if not active or player == null:
		return

	if _attack_timer > 0.0:
		_attack_timer -= delta

	var target := _nearest_enemy()
	if target != null and global_position.distance_to(target.global_position) <= attack_range:
		velocity = Vector2.ZERO
		move_and_slide()
		if _attack_timer <= 0.0:
			_attack_timer = attack_cooldown
			target.take_damage(attack_damage)
			_show_slash(target.global_position - global_position)
			attacked.emit(attack_damage)
		return

	var desired := player.global_position + (global_position - player.global_position).normalized() * follow_distance
	if global_position.distance_to(player.global_position) > follow_distance:
		velocity = (desired - global_position).normalized() * speed
	else:
		velocity = Vector2.ZERO
	move_and_slide()


func _nearest_enemy() -> Node2D:
	var nearest: Node2D
	var nearest_distance := INF
	for enemy in get_tree().get_nodes_in_group("enemies"):
		if not is_instance_valid(enemy) or enemy.health <= 0:
			continue
		var distance := global_position.distance_to(enemy.global_position)
		if distance < nearest_distance:
			nearest = enemy
			nearest_distance = distance
	return nearest


func _show_slash(direction: Vector2) -> void:
	if _pulse_tween != null:
		_pulse_tween.kill()

	slash.rotation = direction.angle()
	slash.visible = true
	slash.modulate.a = 1.0
	_pulse_tween = create_tween()
	_pulse_tween.tween_property(slash, "modulate:a", 0.0, 0.2)
	_pulse_tween.finished.connect(func() -> void:
		slash.visible = false
		slash.modulate.a = 1.0
	)
