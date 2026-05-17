extends Area3D
class_name LootDrop3D

@export var loot_name: String = "Fragmento de Osso"
@export var loot_value: int = 1
@export var auto_pickup: bool = true
@export var pickup_radius: float = 1.5

func _ready() -> void:
	add_to_group("loot")
	# Configure collision to detect only the player (Layer 1)
	collision_layer = 0
	collision_mask = 1
	body_entered.connect(_on_body_entered)
	
	# Set up area shape for detection
	var collision_shape = get_node_or_null("CollisionShape3D") as CollisionShape3D
	if collision_shape and collision_shape.shape is SphereShape3D:
		var sphere_shape = collision_shape.shape as SphereShape3D
		sphere_shape.radius = pickup_radius

func _on_body_entered(body: Node3D) -> void:
	if not auto_pickup:
		return
	
	if body.is_in_group("player"):
		_pickup(body)

func _pickup(player: Node3D) -> void:
	if player.has_method("collect_loot"):
		player.call("collect_loot", loot_name, loot_value)
		print("Loot collected: %s" % loot_name)
		queue_free()

func _input(event: InputEvent) -> void:
	if not auto_pickup and event.is_action_pressed("interact"):
		var bodies = get_overlapping_bodies()
		for body in bodies:
			if body.is_in_group("player"):
				_pickup(body)
				break
