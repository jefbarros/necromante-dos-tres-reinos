extends CharacterBody2D

signal health_changed(enemy: Node, current: int, maximum: int)
signal defeated(enemy: Node, xp_reward: int)

@export var enemy_type: String = "medio"
@export var display_name: String = "Criatura"
@export var max_health: int = 80
@export var speed: float = 92.0
@export var contact_damage: int = 10
@export var attack_cooldown: float = 0.85
@export var xp_reward: int = 45
@export var drop_chance: float = 0.7

var health: int
var target: Node2D
var active: bool = true

var _attack_timer: float = 0.0
var _hit_tween: Tween

@onready var body: Polygon2D = $Body
@onready var bone_mask: Polygon2D = $BoneMask
@onready var hit_flash: Polygon2D = $HitFlash
@onready var collision_shape: CollisionShape2D = $CollisionShape2D


func _ready() -> void:
	add_to_group("enemies")
	health = max_health
	_apply_visuals()
	health_changed.emit(self, health, max_health)


func configure(config: Dictionary, player_target: Node2D) -> void:
	enemy_type = config.get("type", enemy_type)
	display_name = config.get("name", display_name)
	max_health = config.get("health", max_health)
	speed = config.get("speed", speed)
	contact_damage = config.get("damage", contact_damage)
	xp_reward = config.get("xp", xp_reward)
	drop_chance = config.get("drop_chance", drop_chance)
	target = player_target


func _physics_process(delta: float) -> void:
	if not active or target == null or health <= 0:
		velocity = Vector2.ZERO
		move_and_slide()
		return

	if _attack_timer > 0.0:
		_attack_timer -= delta

	var to_target := target.global_position - global_position
	if to_target.length() > 34.0:
		velocity = to_target.normalized() * speed
		move_and_slide()
	else:
		velocity = Vector2.ZERO
		move_and_slide()
		if _attack_timer <= 0.0 and target.has_method("take_damage"):
			_attack_timer = attack_cooldown
			target.take_damage(contact_damage)


func take_damage(amount: int) -> void:
	if health <= 0:
		return

	health = max(health - amount, 0)
	health_changed.emit(self, health, max_health)
	_show_hit_feedback()

	if health == 0:
		active = false
		collision_shape.set_deferred("disabled", true)
		modulate = Color(0.45, 0.45, 0.45, 0.65)
		defeated.emit(self, xp_reward)


func _apply_visuals() -> void:
	if enemy_type == "rapido":
		body.color = Color(0.42, 0.08, 0.1, 1)
		bone_mask.color = Color(0.72, 0.62, 0.47, 1)
		scale = Vector2(0.82, 0.82)
	elif enemy_type == "elite":
		body.color = Color(0.48, 0.03, 0.08, 1)
		bone_mask.color = Color(0.92, 0.78, 0.48, 1)
		scale = Vector2(1.22, 1.22)
	else:
		body.color = Color(0.37, 0.055, 0.075, 1)
		bone_mask.color = Color(0.78, 0.68, 0.52, 1)
		scale = Vector2.ONE


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
