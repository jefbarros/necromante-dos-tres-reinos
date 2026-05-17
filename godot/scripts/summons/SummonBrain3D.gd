extends Node
class_name SummonBrain3D

enum CommandMode {
	FOLLOW,
	ATTACK,
	RECALL,
}


static func get_command_name(mode: int) -> String:
	match mode:
		CommandMode.ATTACK:
			return "ATTACK"
		CommandMode.RECALL:
			return "RECALL"
		_:
			return "FOLLOW"
