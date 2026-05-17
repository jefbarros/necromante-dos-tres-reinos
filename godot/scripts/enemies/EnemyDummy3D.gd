extends CharacterBody3D

@export var max_health: float = 50.0
@export var patrol_radius: float = 0.75
@export var patrol_speed: float = 0.75
@export var gravity: float = 24.0

var health: float
var _spawn_position: Vector3
var _time: float = 0.0
var _dead: bool = false


func _ready() -> void:
	add_to_group("enemy")
	health = max_health
	_spawn_position = global_position


func _physics_process(delta: float) -> void:
	if _dead:
		return

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = minf(velocity.y, 0.0)

	_time += delta
	var offset := Vector3(cos(_time) * patrol_radius, 0.0, sin(_time) * patrol_radius)
	var target := _spawn_position + offset
	var direction := global_position.direction_to(target)
	velocity.x = direction.x * patrol_speed
	velocity.z = direction.z * patrol_speed
	move_and_slide()


func receive_damage(amount: float) -> void:
	if _dead:
		return

	health -= amount
	print("EnemyDummy3D recebeu %.1f de dano. Vida restante: %.1f" % [amount, health])
	if health <= 0.0:
		_die()


func _die() -> void:
	_dead = true
	set_physics_process(false)
	visible = false
	collision_layer = 0
	collision_mask = 0
	print("EnemyDummy3D desativado.")
