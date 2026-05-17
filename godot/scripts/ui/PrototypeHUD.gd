extends CanvasLayer
class_name PrototypeHUD

@export var max_summons: int = 2
var _arena_manager: Node = null

@onready var _health_label: Label = $Panel/MarginContainer/VBoxContainer/HealthLabel
@onready var _essence_label: Label = $Panel/MarginContainer/VBoxContainer/EssenceLabel
@onready var _summon_label: Label = $Panel/MarginContainer/VBoxContainer/SummonLabel
@onready var _command_label: Label = $Panel/MarginContainer/VBoxContainer/CommandLabel
@onready var _hint_label: Label = $Panel/MarginContainer/VBoxContainer/HintLabel
@onready var _dungeon_label: Label = $Panel/MarginContainer/VBoxContainer/DungeonLabel
@onready var _room_label: Label = $Panel/MarginContainer/VBoxContainer/RoomLabel
@onready var _enemies_label: Label = $Panel/MarginContainer/VBoxContainer/EnemiesLabel
@onready var _context_label: Label = $Panel/MarginContainer/VBoxContainer/ContextLabel
@onready var _quest_label: Label = $Panel/MarginContainer/VBoxContainer/QuestLabel
@onready var _objective_label: Label = $Panel/MarginContainer/VBoxContainer/ObjectiveLabel


func _ready() -> void:
	_hint_label.text = "E | R | 1/2/3 | F5"
	if _quest_label != null:
		_quest_label.text = "Quest: Nenhuma"
	if _objective_label != null:
		_objective_label.text = "Objetivo: -"
	_arena_manager = get_tree().get_first_node_in_group("arena_manager")
	_update_labels()


func _process(_delta: float) -> void:
	_update_labels()


func _update_labels() -> void:
	var player := get_tree().get_first_node_in_group("player")
	var limit := max_summons
	var active_summons := get_tree().get_nodes_in_group("summon").size()
	var command_name := "FOLLOW"
	var lv_text = "LV: 1 (0/100)"
	var arena_text = "Arena: PRONTO | Onda: 0"
	var loot_text = "Loot: 0 (Nenhum)"

	if player != null:
		var health := player.get_node_or_null("HealthComponent")
		if health != null:
			_health_label.text = "HP: %.0f/%.0f" % [
				float(health.get("current_health")),
				float(health.get("max_health")),
			]

		var essence := player.get_node_or_null("EssenceComponent")
		if essence != null:
			_essence_label.text = "Essencia: %d/%d" % [
				int(essence.get("current_essence")),
				int(essence.get("max_essence")),
			]

		var xp = player.get_node_or_null("ExperienceComponent")
		if xp:
			lv_text = "LV: %d (%d/%d)" % [
				int(xp.get("current_level")),
				int(xp.get("current_xp")),
				int(xp.get("xp_to_next_level"))
			]
		
		var loot_count: int = 0
		var loot_name: String = "Nenhum"
		if player.has("loot_collected_count"):
			loot_count = int(player.get("loot_collected_count"))
		if player.has("last_loot_name"):
			loot_name = String(player.get("last_loot_name"))
		loot_text = "Loot: %d (%s)" % [loot_count, loot_name]

		var skill := player.get_node_or_null("RaiseSkeletonSkill")
		if skill != null:
			limit = int(skill.get("max_active_summons"))
			if skill.has_method("get_active_summons"):
				active_summons = int(skill.call("get_active_summons"))

		var command_component := player.get_node_or_null("SummonCommandComponent")
		if command_component != null and command_component.has_method("get_command_name"):
			command_name = String(command_component.call("get_command_name"))

	if _arena_manager == null:
		_arena_manager = get_tree().get_first_node_in_group("arena_manager")
	
	if _arena_manager:
		arena_text = "Arena: %s | Onda: %d | Vivos: %d" % [
			_arena_manager.call("get_current_state_name"),
			_arena_manager.get("current_wave"),
			_arena_manager.get("enemies_alive")
		]
	else:
		_health_label.text = "HP: -/-"

	var dungeon_manager := get_tree().get_first_node_in_group("dungeon_manager")
	var dungeon_text := "Dungeon: Inativa"
	var room_text := "Sala: -"
	var enemies_text := "Inimigos: -"
	var context_text := ""
	if dungeon_manager != null:
		dungeon_text = "Dungeon: %s" % String(dungeon_manager.get("dungeon_name"))
		room_text = "Sala: %s" % String(dungeon_manager.get("current_room_name"))
		enemies_text = "Inimigos: %d" % int(dungeon_manager.get("enemies_alive"))
		context_text = String(dungeon_manager.get("dungeon_hint"))

_summon_label.text = "Servos: %d/%d | %s" % [active_summons, limit, command_name]
	_essence_label.text = "%s | %s" % [_essence_label.text, lv_text]
	_command_label.text = arena_text
	_health_label.text = "%s | %s" % [_health_label.text, loot_text]
	_dungeon_label.text = dungeon_text
	_room_label.text = room_text
	_enemies_label.text = enemies_text
_context_label.text = context_text if context_text != "" else _hint_label.text

	# Quest display
	var quest_mgr := get_tree().get_first_node_in_group("quest_manager")
	if quest_mgr != null:
		var quest_text := "Quest: O Despertar na Cripta"
		var objective_text := "Objetivo: " + String(quest_mgr.call("get_objective_text"))
		if _quest_label != null:
			_quest_label.text = quest_text
		if _objective_label != null:
			_objective_label.text = objective_text
	else:
		if _quest_label != null:
			_quest_label.text = "Quest: Nenhuma"
		if _objective_label != null:
			_objective_label.text = "Objetivo: -"
