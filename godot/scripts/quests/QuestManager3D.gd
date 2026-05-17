extends Node
class_name QuestManager3D

## Simple quest state machine for the vertical slice.
## Manages the main quest: "O Despertar na Cripta"

enum QuestState {
	NOT_STARTED,
	TALK_TO_MARA,
	ENTER_CRYPT,
	CLEAR_ROOM_1,
	CLEAR_ROOM_2,
	DEFEAT_RAVAN,
	COLLECT_REWARD,
	RETURN_TO_HUB,
	COMPLETED
}

const STATE_NAMES := {
	QuestState.NOT_STARTED: "Não iniciada",
	QuestState.TALK_TO_MARA: "Fale com Mara",
	QuestState.ENTER_CRYPT: "Entre na Cripta de Veyrfall",
	QuestState.CLEAR_ROOM_1: "Limpe a primeira sala",
	QuestState.CLEAR_ROOM_2: "Avance pela cripta",
	QuestState.DEFEAT_RAVAN: "Derrote Ravan, Lâmina da Chama Branca",
	QuestState.COLLECT_REWARD: "Colete a recompensa",
	QuestState.RETURN_TO_HUB: "Retorne ao hub",
	QuestState.COMPLETED: "Vertical Slice concluída"
}

signal quest_updated(state: QuestState, objective_text: String)
signal quest_completed()

var current_state: QuestState = QuestState.NOT_STARTED


func _ready() -> void:
	add_to_group("quest_manager")
	print("QuestManager initialized")


func get_current_state_name() -> String:
	return STATE_NAMES.get(current_state, "Desconhecido")


func get_objective_text() -> String:
	return STATE_NAMES.get(current_state, "")


func is_completed() -> bool:
	return current_state == QuestState.COMPLETED


func start_main_quest() -> void:
	if current_state != QuestState.NOT_STARTED:
		return
	advance_to(QuestState.TALK_TO_MARA)


func advance_to(new_state: QuestState) -> void:
	if new_state <= current_state:
		return
	current_state = new_state
	print("Quest state: %s" % get_objective_text())
	emit_signal("quest_updated", current_state, get_objective_text())
	if current_state == QuestState.COMPLETED:
		emit_signal("quest_completed")


func advance_if_current(expected_state: QuestState) -> void:
	if current_state == expected_state:
		var next := _get_next_state(expected_state)
		if next != expected_state:
			advance_to(next)


func _get_next_state(from_state: QuestState) -> QuestState:
	match from_state:
		QuestState.NOT_STARTED:
			return QuestState.TALK_TO_MARA
		QuestState.TALK_TO_MARA:
			return QuestState.ENTER_CRYPT
		QuestState.ENTER_CRYPT:
			return QuestState.CLEAR_ROOM_1
		QuestState.CLEAR_ROOM_1:
			return QuestState.CLEAR_ROOM_2
		QuestState.CLEAR_ROOM_2:
			return QuestState.DEFEAT_RAVAN
		QuestState.DEFEAT_RAVAN:
			return QuestState.COLLECT_REWARD
		QuestState.COLLECT_REWARD:
			return QuestState.RETURN_TO_HUB
		QuestState.RETURN_TO_HUB:
			return QuestState.COMPLETED
	return from_state


func get_save_data() -> Dictionary:
	return {
		"main_quest_state": current_state
	}


func load_from_data(data: Dictionary) -> void:
	if data.has("main_quest_state"):
		var loaded: Variant = data["main_quest_state"]
		if loaded is int and loaded >= 0 and loaded < QuestState.size():
			current_state = loaded
			print("Quest loaded: %s" % get_objective_text())
