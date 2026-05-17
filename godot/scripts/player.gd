extends CharacterBody2D

signal health_changed(current: int, maximum: int)
signal mana_changed(current: int, maximum: int)
signal attack_performed(damage: int, hits: int)
signal status_changed(text: String)

@export var speed: float = 220.0
@export var max_health: int = 100
@export var max_mana: int = 50
@export var attack_damage: int = 25
@export var attack_range: float = 48.0
@export var attack_cooldown: float = 0.35

var health: int
var mana: int
var last_direction: Vector2 = Vector2.RIGHT
var _attack_timer: float = 0.0

@onready var attack_area: Area2D = $AttackArea
@onready var attack_shape: CollisionShape2D = $AttackArea/CollisionShape2D


func _ready() -> void:
	health = max_health
	mana = max_mana
	attack_area.position = last_direction * attack_range
	health_changed.emit(health, max_health)
	mana_changed.emit(mana, max_mana)


func _physics_process(delta: float) -> void:
	if _attack_timer > 0.0:
		_attack_timer -= delta

	var input_vector := _read_movement_input()
	if input_vector != Vector2.ZERO:
		last_direction = input_vector.normalized()

	velocity = input_vector.normalized() * speed
	move_and_slide()

	if Input.is_action_just_pressed("basic_attack"):
		try_attack()


func take_damage(amount: int) -> void:
	health = max(health - amount, 0)
	health_changed.emit(health, max_health)
	if health == 0:
		status_changed.emit("Player derrotado no prototipo G1.")


func try_attack() -> void:
	if _attack_timer > 0.0:
		return

	_attack_timer = attack_cooldown
	attack_area.position = last_direction * attack_range

	var query := PhysicsShapeQueryParameters2D.new()
	query.shape = attack_shape.shape
	query.transform = Transform2D(0.0, global_position + last_direction * attack_range)
	query.collision_mask = 2
	query.exclude = [get_rid()]

	var hits: Array[Dictionary] = get_world_2d().direct_space_state.intersect_shape(query, 16)
	var hit_count: int = 0
	for hit in hits:
		var target: Object = hit.get("collider") as Object
		if target != null and target.has_method("take_damage"):
			target.take_damage(attack_damage)
			hit_count += 1

	attack_performed.emit(attack_damage, hit_count)
	if hit_count > 0:
		status_changed.emit("Ataque acertou %d alvo(s)." % hit_count)
	else:
		status_changed.emit("Ataque sem alvo no alcance.")


func _read_movement_input() -> Vector2:
	return Input.get_vector("move_left", "move_right", "move_up", "move_down")
