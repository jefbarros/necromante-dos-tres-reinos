extends CharacterBody2D

signal health_changed(current: int, maximum: int)
signal mana_changed(current: int, maximum: int)
signal attack_performed(damage: int, hits: int)
signal status_changed(text: String)
signal died

@export var speed: float = 225.0
@export var max_health: int = 160
@export var max_mana: int = 60
@export var attack_damage: int = 34
@export var attack_range: float = 70.0
@export var attack_cooldown: float = 0.38

var health: int
var mana: int
var level: int = 1
var xp: int = 0
var xp_to_next: int = 100
var last_direction: Vector2 = Vector2.RIGHT
var can_act: bool = false

var _attack_timer: float = 0.0
var _hurt_timer: float = 0.0
var _hit_tween: Tween
var _attack_feedback_tween: Tween

@onready var attack_shape: CollisionShape2D = $AttackArea/CollisionShape2D
@onready var attack_feedback: Polygon2D = $AttackFeedback
@onready var hit_flash: Polygon2D = $HitFlash


func _ready() -> void:
	reset_run()


func reset_run() -> void:
	health = max_health
	mana = max_mana
	level = 1
	xp = 0
	xp_to_next = 100
	attack_damage = 24
	last_direction = Vector2.RIGHT
	can_act = false
	_attack_timer = 0.0
	modulate = Color.WHITE
	health_changed.emit(health, max_health)
	mana_changed.emit(mana, max_mana)


func _physics_process(delta: float) -> void:
	if _attack_timer > 0.0:
		_attack_timer -= delta
	if _hurt_timer > 0.0:
		_hurt_timer -= delta

	if not can_act or health <= 0:
		velocity = Vector2.ZERO
		move_and_slide()
		return

	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	if input_vector != Vector2.ZERO:
		last_direction = input_vector.normalized()

	velocity = input_vector.normalized() * speed
	move_and_slide()

	if Input.is_action_just_pressed("basic_attack"):
		try_attack()


func take_damage(amount: int) -> void:
	if health <= 0 or _hurt_timer > 0.0:
		return

	_hurt_timer = 0.45
	health = max(health - amount, 0)
	health_changed.emit(health, max_health)
	_show_hit_feedback()

	if health == 0:
		can_act = false
		status_changed.emit("O necromante caiu.")
		died.emit()


func heal(amount: int) -> int:
	if health <= 0:
		return 0

	var before := health
	health = min(health + amount, max_health)
	health_changed.emit(health, max_health)
	return health - before


func restore_mana(amount: int) -> int:
	var before := mana
	mana = min(mana + amount, max_mana)
	mana_changed.emit(mana, max_mana)
	return mana - before


func gain_xp(amount: int) -> bool:
	xp += amount
	var leveled := false
	while xp >= xp_to_next:
		xp -= xp_to_next
		level += 1
		xp_to_next += 60
		max_health += 16
		max_mana += 8
		attack_damage += 5
		health = min(health + 45, max_health)
		mana = min(mana + 25, max_mana)
		leveled = true

	if leveled:
		health_changed.emit(health, max_health)
		mana_changed.emit(mana, max_mana)

	return leveled


func try_attack() -> void:
	if _attack_timer > 0.0 or not can_act or health <= 0:
		return

	_attack_timer = attack_cooldown
	_show_attack_feedback()

	var query := PhysicsShapeQueryParameters2D.new()
	query.shape = attack_shape.shape
	query.transform = Transform2D(0.0, global_position + last_direction * attack_range)
	query.collision_mask = 2
	query.exclude = [get_rid()]

	var hits: Array[Dictionary] = get_world_2d().direct_space_state.intersect_shape(query, 16)
	var hit_count := 0
	for hit in hits:
		var target := hit.get("collider") as Object
		if target != null and target.has_method("take_damage"):
			target.take_damage(attack_damage)
			hit_count += 1

	attack_performed.emit(attack_damage, hit_count)
	if hit_count > 0:
		status_changed.emit("Ataque acertou: %d dano." % attack_damage)
	else:
		status_changed.emit("Ataque errou: inimigo fora do alcance.")


func _show_attack_feedback() -> void:
	if _attack_feedback_tween != null:
		_attack_feedback_tween.kill()

	attack_feedback.rotation = last_direction.angle()
	attack_feedback.visible = true
	attack_feedback.modulate.a = 1.0
	_attack_feedback_tween = create_tween()
	_attack_feedback_tween.tween_property(attack_feedback, "modulate:a", 0.0, 0.18)
	_attack_feedback_tween.finished.connect(func() -> void:
		attack_feedback.visible = false
		attack_feedback.modulate.a = 1.0
	)


func _show_hit_feedback() -> void:
	if _hit_tween != null:
		_hit_tween.kill()

	hit_flash.visible = true
	hit_flash.modulate.a = 1.0
	_hit_tween = create_tween()
	_hit_tween.tween_property(hit_flash, "modulate:a", 0.0, 0.25)
	_hit_tween.finished.connect(func() -> void:
		hit_flash.visible = false
		hit_flash.modulate.a = 1.0
	)
