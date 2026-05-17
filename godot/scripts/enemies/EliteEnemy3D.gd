extends "res://scripts/enemies/EnemyDummy3D.gd"

func _ready() -> void:
	max_health = 180.0
	attack_damage = 18.0
	xp_reward = 100
	essence_reward = 30
	loot_drop_chance = 1.0
	scale = Vector3(1.3, 1.3, 1.3)
	super()._ready()
	if _body != null:
		var elite_material := StandardMaterial3D.new()
		elite_material.albedo_color = Color(0.44, 0.23, 0.87, 1.0)
		elite_material.metallic = 0.18
		elite_material.roughness = 0.28
		_body.set_surface_override_material(0, elite_material)
	print("EliteEnemy ready")

func _die(source: Node = null) -> void:
	print("EliteEnemy died")
	super()._die(source)
	print("Dungeon elite defeated")
