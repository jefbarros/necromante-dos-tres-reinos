extends CharacterBody3D

@export var max_health: float = 50.0
@export var patrol_radius: float = 0.75
@export var patrol_speed: float = 0.75
@export var gravity: float = 24.0
@export var corpse_scene: PackedScene = preload("res://scenes/necromancy/Corpse3D.tscn")

var _spawn_position: Vector3
var _time: float = 0.0
var _dead: bool = false
var _corpse_spawned: bool = false
var _alive_material: Material

@onready var _health_component: Node = $HealthComponent
@onready var _body: MeshInstance3D = $Body
@onready var _collision_shape: CollisionShape3D = $CollisionShape3D
@onready var _hurtbox: Area3D = $Hurtbox3D


func _ready() -> void:
	add_to_group("enemy")
	_health_component.set("max_health", max_health)
	_health_component.set("current_health", max_health)
	if _health_component.has_signal("damaged"):
		_health_component.connect("damaged", Callable(self, "_on_damaged"))
	if _health_component.has_signal("died"):
		_health_component.connect("died", Callable(self, "_on_died"))
	_alive_material = _body.get_active_material(0)
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

	if _health_component.has_method("take_damage"):
		_health_component.call("take_damage", amount)


func is_dead() -> bool:
	return _dead


func _on_damaged(amount: float, source: Node) -> void:
	print("EnemyDummy3D received %.1f damage. Health: %.1f/%.1f" % [
		amount,
		_health_component.get("current_health"),
		_health_component.get("max_health"),
	])
	_flash_damage()


func _on_died(source: Node) -> void:
	_die()


func _die() -> void:
	if _dead:
		return

	_dead = true
	remove_from_group("enemy")
	set_physics_process(false)
	velocity = Vector3.ZERO
	collision_layer = 0
	collision_mask = 0
	_collision_shape.set_deferred("disabled", true)
	if _hurtbox.has_method("set_hurtbox_enabled"):
		_hurtbox.call("set_hurtbox_enabled", false)

	var corpse_material := StandardMaterial3D.new()
	corpse_material.albedo_color = Color(0.08, 0.08, 0.08, 1.0)
	corpse_material.roughness = 0.95
	_body.set_surface_override_material(0, corpse_material)

	print("EnemyDummy died")
	_spawn_corpse()
	hide()


func _spawn_corpse() -> void:
	if _corpse_spawned or corpse_scene == null:
		return

	_corpse_spawned = true
	var corpse := corpse_scene.instantiate() as Node3D
	if corpse == null:
		return

	var spawn_parent := get_parent()
	if spawn_parent == null:
		spawn_parent = get_tree().current_scene
	spawn_parent.add_child(corpse)
	corpse.global_position = global_position
	print("Corpse spawned")


func _flash_damage() -> void:
	if _dead or _body == null:
		return

	var flash_material := StandardMaterial3D.new()
	flash_material.albedo_color = Color(1.0, 0.25, 0.2, 1.0)
	_body.set_surface_override_material(0, flash_material)

	var tween := create_tween()
	tween.tween_interval(0.08)
	tween.tween_callback(_restore_alive_material)


func _restore_alive_material() -> void:
	if not _dead and _body != null:
		_body.set_surface_override_material(0, _alive_material)
