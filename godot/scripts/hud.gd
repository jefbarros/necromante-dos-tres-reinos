extends CanvasLayer

signal start_requested
signal restart_requested

@onready var health_label: Label = $Root/Panel/HealthLabel
@onready var mana_label: Label = $Root/Panel/ManaLabel
@onready var level_label: Label = $Root/Panel/LevelLabel
@onready var wave_label: Label = $Root/Panel/WaveLabel
@onready var enemies_label: Label = $Root/Panel/EnemiesLabel
@onready var servants_label: Label = $Root/Panel/ServantsLabel
@onready var objective_label: Label = $Root/Panel/ObjectiveLabel
@onready var inventory_label: Label = $Root/Panel/InventoryLabel
@onready var status_label: Label = $Root/StatusLabel
@onready var controls_label: Label = $Root/ControlsLabel
@onready var feedback_label: Label = $Root/FeedbackLabel
@onready var overlay: ColorRect = $Root/Overlay
@onready var overlay_title: Label = $Root/Overlay/TitleLabel
@onready var overlay_body: Label = $Root/Overlay/BodyLabel
@onready var inventory_panel: ColorRect = $Root/InventoryPanel
@onready var inventory_panel_label: Label = $Root/InventoryPanel/InventoryPanelLabel

var _feedback_tween: Tween


func _ready() -> void:
	controls_label.text = "Enter: iniciar/reiniciar | WASD/setas: mover | 1/clique: ataque | C: erguer servo | I: inventario | Q: pocao"
	status_label.text = "G3.0 pronto."
	set_inventory_visible(false)


func show_start() -> void:
	overlay.visible = true
	overlay_title.text = "Necromante dos Tres Reinos"
	overlay_body.text = "MVP Godot G3.0\n\nSobreviva as ondas e erga seu primeiro servo.\n\nEnter para iniciar."


func show_victory() -> void:
	overlay.visible = true
	overlay_title.text = "MVP G3.0 concluido"
	overlay_body.text = "O necromante ergueu sua primeira tropa.\n\nEnter para reiniciar."


func show_game_over() -> void:
	overlay.visible = true
	overlay_title.text = "Derrota"
	overlay_body.text = "O necromante foi vencido antes de consolidar sua tropa.\n\nEnter para reiniciar."


func hide_overlay() -> void:
	overlay.visible = false


func set_health(current: int, maximum: int) -> void:
	health_label.text = "Vida: %d/%d" % [current, maximum]


func set_mana(current: int, maximum: int) -> void:
	mana_label.text = "Mana: %d/%d" % [current, maximum]


func set_level_xp(level: int, xp: int, xp_to_next: int) -> void:
	level_label.text = "Nivel: %d  XP: %d/%d" % [level, xp, xp_to_next]


func set_wave(current: int, total: int) -> void:
	wave_label.text = "Onda: %d/%d" % [current, total]


func set_enemies_remaining(count: int) -> void:
	enemies_label.text = "Inimigos: %d" % count


func set_servants(count: int, maximum: int) -> void:
	servants_label.text = "Servos: %d/%d" % [count, maximum]


func set_objective(text: String) -> void:
	objective_label.text = "Objetivo: %s" % text


func set_inventory(items: Dictionary) -> void:
	inventory_label.text = "Pocoes: %d | Essencias: %d | Fragmentos: %d" % [
		items.get("pocao", 0),
		items.get("essencia", 0),
		items.get("fragmento", 0),
	]
	inventory_panel_label.text = "Inventario\n\nPocao de vida: %d\nEssencia de alma: %d\nFragmento sombrio: %d\n\nQ usa pocao de vida." % [
		items.get("pocao", 0),
		items.get("essencia", 0),
		items.get("fragmento", 0),
	]


func set_inventory_visible(visible: bool) -> void:
	inventory_panel.visible = visible


func set_status(text: String) -> void:
	status_label.text = text


func show_feedback(text: String, color: Color) -> void:
	if _feedback_tween != null:
		_feedback_tween.kill()

	feedback_label.text = text
	feedback_label.modulate = color
	_feedback_tween = create_tween()
	_feedback_tween.tween_interval(0.8)
	_feedback_tween.tween_property(feedback_label, "modulate:a", 0.0, 0.35)
	_feedback_tween.finished.connect(func() -> void:
		feedback_label.text = ""
		feedback_label.modulate.a = 1.0
	)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_ENTER:
		if overlay.visible:
			if overlay_title.text == "Necromante dos Tres Reinos":
				start_requested.emit()
			else:
				restart_requested.emit()
