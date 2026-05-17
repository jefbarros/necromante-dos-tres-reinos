extends Node
class_name RaiseSkeletonSkill

const RESULT_RAISED := "raised"
const RESULT_NO_CORPSE := "no_corpse"
const RESULT_LIMIT_REACHED := "limit_reached"
const RESULT_MISSING_SCENE := "missing_scene"
const RESULT_NOT_ENOUGH_ESSENCE := "not_enough_essence"

@export var summon_scene: PackedScene = preload("res://scenes/summons/SkeletonServant3D.tscn")
@export var archer_summon_scene: PackedScene = preload("res://scenes/summons/SkeletonArcherServant3D.tscn")
@export var raise_radius: float = 4.0
@export var max_active_summons: int = 2
@export var summon_spawn_offset: Vector3 = Vector3(0.9, 0.0, 0.45)
@export var skeleton_essence_cost: int = 15
@export var archer_essence_cost: int = 20

var active_summons: Array[Node3D] = []


func try_raise_skeleton() -> String:
	cleanup_invalid_summons()
	if active_summons.size() >= max_active_summons:
		return RESULT_LIMIT_REACHED

	var corpse := find_nearest_corpse()
	if corpse == null:
		return RESULT_NO_CORPSE

	var player := get_parent() as Node3D
	var essence_component := player.get_node_or_null("EssenceComponent") if player != null else null
	if essence_component == null or not essence_component.has_method("spend_essence"):
		print("Not enough essence to raise skeleton")
		return RESULT_NOT_ENOUGH_ESSENCE

	var scene_to_spawn := summon_scene
	if corpse.get("summon_scene") is PackedScene:
		scene_to_spawn = corpse.get("summon_scene")
	if scene_to_spawn == null:
		return RESULT_MISSING_SCENE

	var summon: Node3D = scene_to_spawn.instantiate() as Node3D
	if summon == null:
		return RESULT_MISSING_SCENE

	if not bool(essence_component.call("spend_essence", skeleton_essence_cost)):
		print("Not enough essence to raise skeleton")
		return RESULT_NOT_ENOUGH_ESSENCE

	var spawn_parent := player.get_parent() if player != null and player.get_parent() != null else get_tree().current_scene
	if spawn_parent == null:
		spawn_parent = get_tree().root

	spawn_parent.add_child(summon)
	var raise_position := corpse.global_position
	if corpse.has_method("get_raise_position"):
		raise_position = corpse.call("get_raise_position")
	summon.global_position = raise_position + summon_spawn_offset
	if player != null:
		summon.set("owner_node", player)
		summon.set("owner_path", summon.get_path_to(player))
		var command_component := player.get_node_or_null("SummonCommandComponent")
		if command_component != null and command_component.has_method("apply_current_mode_to"):
			command_component.call("apply_current_mode_to", summon)

	active_summons.append(summon)
	if corpse.has_method("consume"):
		corpse.call("consume")
	return RESULT_RAISED


func find_nearest_corpse() -> Node3D:
	var player := get_parent() as Node3D
	if player == null:
		return null

	var nearest: Node3D = null
	var nearest_distance := raise_radius
	for corpse in get_tree().get_nodes_in_group("corpse"):
		var corpse_node := corpse as Node3D
		if corpse_node == null or not is_instance_valid(corpse_node):
			continue
		if corpse_node.has_method("can_raise") and not corpse_node.can_raise():
			continue

		var distance := player.global_position.distance_to(corpse_node.global_position)
		if distance <= nearest_distance:
			nearest = corpse_node
			nearest_distance = distance

	return nearest


func get_active_summons() -> int:
	cleanup_invalid_summons()
	return active_summons.size()


func cleanup_invalid_summons() -> void:
	for index in range(active_summons.size() - 1, -1, -1):
		var summon := active_summons[index]
		if summon == null or not is_instance_valid(summon) or not summon.is_inside_tree():
			active_summons.remove_at(index)


func try_raise_archer() -> String:
	cleanup_invalid_summons()
	if archer_summon_scene == null:
		return RESULT_MISSING_SCENE
	if active_summons.size() >= max_active_summons:
		return RESULT_LIMIT_REACHED

	var corpse := find_nearest_corpse()
	if corpse == null:
		return RESULT_NO_CORPSE

	var player := get_parent() as Node3D
	var essence_component := player.get_node_or_null("EssenceComponent") if player != null else null
	if essence_component == null or not essence_component.has_method("spend_essence"):
		return RESULT_NOT_ENOUGH_ESSENCE

	var summon: Node3D = archer_summon_scene.instantiate() as Node3D
	if summon == null:
		return RESULT_MISSING_SCENE

	if not bool(essence_component.call("spend_essence", archer_essence_cost)):
		return RESULT_NOT_ENOUGH_ESSENCE

	var spawn_parent := player.get_parent() if player != null and player.get_parent() != null else get_tree().current_scene
	if spawn_parent == null:
		spawn_parent = get_tree().root

	spawn_parent.add_child(summon)
	var raise_position := corpse.global_position
	if corpse.has_method("get_raise_position"):
		raise_position = corpse.call("get_raise_position")
	summon.global_position = raise_position + summon_spawn_offset
	if player != null:
		summon.set("owner_node", player)
		summon.set("owner_path", summon.get_path_to(player))
		var command_component := player.get_node_or_null("SummonCommandComponent")
		if command_component != null and command_component.has_method("apply_current_mode_to"):
			command_component.call("apply_current_mode_to", summon)

	active_summons.append(summon)
	if corpse.has_method("consume"):
		corpse.call("consume")
	return RESULT_RAISED
