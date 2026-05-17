extends Node
class_name RaiseSkeletonSkill

const RESULT_RAISED := "raised"
const RESULT_NO_CORPSE := "no_corpse"
const RESULT_LIMIT_REACHED := "limit_reached"
const RESULT_MISSING_SCENE := "missing_scene"

@export var summon_scene: PackedScene = preload("res://scenes/summons/SkeletonServant3D.tscn")
@export var raise_radius: float = 4.0
@export var max_active_summons: int = 2
@export var summon_spawn_offset: Vector3 = Vector3(0.9, 0.0, 0.45)

var active_summons: Array[Node3D] = []


func try_raise_skeleton() -> String:
	cleanup_invalid_summons()
	if active_summons.size() >= max_active_summons:
		return RESULT_LIMIT_REACHED

	var corpse := find_nearest_corpse()
	if corpse == null:
		return RESULT_NO_CORPSE

	var scene_to_spawn := summon_scene
	if corpse.get("summon_scene") is PackedScene:
		scene_to_spawn = corpse.get("summon_scene")
	if scene_to_spawn == null:
		return RESULT_MISSING_SCENE

	var summon := scene_to_spawn.instantiate() as Node3D
	if summon == null:
		return RESULT_MISSING_SCENE

	var player := get_parent() as Node3D
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
