extends CanvasLayer

signal start_requested
signal restart_requested
signal attack_requested
signal capture_requested
signal potion_requested

@onready var root: Control = $Root
@onready var panel: ColorRect = $Root/Panel
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
@onready var touch_panel: Control = $Root/TouchPanel
@onready var attack_button: Button = $Root/TouchPanel/AttackButton
@onready var capture_button: Button = $Root/TouchPanel/CaptureButton
@onready var potion_button: Button = $Root/TouchPanel/PotionButton

var _feedback_tween: Tween
var _compact_layout := false


func _ready() -> void:
	controls_label.text = "Enter/clique: iniciar/reiniciar | WASD/setas: mover | 1/clique: ataque | C: servo | I: inventario | Q: pocao"
	status_label.text = "G3.0 pronto."
	attack_button.pressed.connect(attack_requested.emit)
	capture_button.pressed.connect(capture_requested.emit)
	potion_button.pressed.connect(potion_requested.emit)
	get_viewport().size_changed.connect(_apply_responsive_layout)
	set_inventory_visible(false)
	_apply_responsive_layout()


func show_start() -> void:
	overlay.visible = true
	overlay_title.text = "Necromante dos Tres Reinos"
	overlay_body.text = "MVP Godot G3.0\n\nSobreviva as ondas e erga seu primeiro servo.\n\nEnter ou clique para iniciar."
	_apply_responsive_layout()


func show_victory() -> void:
	overlay.visible = true
	overlay_title.text = "MVP G3.0 concluido"
	overlay_body.text = "O necromante ergueu sua primeira tropa.\n\nEnter ou clique para reiniciar."
	_apply_responsive_layout()


func show_game_over() -> void:
	overlay.visible = true
	overlay_title.text = "Derrota"
	overlay_body.text = "O necromante foi vencido antes de consolidar sua tropa.\n\nEnter ou clique para reiniciar."
	_apply_responsive_layout()


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
	inventory_label.text = "Pocoes: %d | Ess: %d | Frag: %d" % [
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
		_emit_overlay_action()
	elif overlay.visible and event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_emit_overlay_action()
	elif overlay.visible and event is InputEventScreenTouch and event.pressed:
		_emit_overlay_action()


func _emit_overlay_action() -> void:
	if not overlay.visible:
		return
	if overlay_title.text == "Necromante dos Tres Reinos":
		start_requested.emit()
	else:
		restart_requested.emit()


func _apply_responsive_layout() -> void:
	var size := get_viewport().get_visible_rect().size
	var window_size := Vector2(DisplayServer.window_get_size())
	var reference_size := window_size if window_size.x > 0.0 and window_size.y > 0.0 else size
	var compact := reference_size.x < 980.0 or reference_size.y < 560.0
	var portrait := reference_size.y > reference_size.x
	_compact_layout = compact or portrait

	var ui_scale := 1.0
	if portrait:
		ui_scale = 0.68
	elif compact:
		ui_scale = 0.76

	panel.scale = Vector2.ONE * ui_scale
	panel.position = Vector2(8, 8)
	panel.size = Vector2(392, 240)

	inventory_panel.scale = Vector2.ONE * ui_scale
	inventory_panel.size = Vector2(346, 170)
	inventory_panel.position = Vector2(
		max(12.0, size.x - inventory_panel.size.x * ui_scale - 12.0),
		72.0 if not portrait else 184.0
	)

	var bottom_margin := 74.0 if not _compact_layout else 44.0
	controls_label.position = Vector2(8, max(8.0, size.y - bottom_margin))
	controls_label.size = Vector2(max(240.0, size.x - 16.0), 24)
	controls_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status_label.position = Vector2(8, max(30.0, size.y - 28.0))
	status_label.size = Vector2(max(240.0, size.x - 16.0), 24)
	status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART

	feedback_label.position = Vector2(max(16.0, size.x * 0.36), 96)
	feedback_label.size = Vector2(min(420.0, max(220.0, size.x * 0.42)), 36)

	var panel_right := panel.position.x + panel.size.x * ui_scale
	var overlay_margin := Vector2(48, 72)
	if portrait:
		overlay_margin = Vector2(32, 300)
	elif _compact_layout:
		overlay_margin = Vector2(panel_right + 32.0, 96)
	overlay.size = Vector2(
		min(760.0, max(280.0, size.x - overlay_margin.x)),
		min(430.0, max(176.0, size.y - overlay_margin.y))
	)
	overlay.position = (size - overlay.size) * 0.5
	if not portrait:
		overlay.position.x = clamp(
			max(overlay.position.x, panel_right + 24.0),
			12.0,
			max(12.0, size.x - overlay.size.x - 12.0)
		)
	var overlay_padding := 42.0 if not _compact_layout else 24.0
	var title_size := 32
	var body_size := 18
	if portrait:
		title_size = 13
		body_size = 9
	elif _compact_layout:
		title_size = 20
		body_size = 12
	overlay_title.add_theme_font_size_override("font_size", title_size)
	overlay_body.add_theme_font_size_override("font_size", body_size)
	overlay_title.position = Vector2(overlay_padding, overlay_padding * 0.76)
	overlay_title.size = Vector2(max(190.0, overlay.size.x - overlay_padding * 2.0), 42)
	overlay_title.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	overlay_body.position = Vector2(overlay_padding, overlay_padding + 62.0)
	overlay_body.size = Vector2(
		max(190.0, overlay.size.x - overlay_padding * 2.0),
		max(92.0, overlay.size.y - overlay_padding - 74.0)
	)

	touch_panel.visible = _compact_layout
	touch_panel.scale = Vector2.ONE * (0.86 if portrait else 0.92)
	touch_panel.position = Vector2(
		max(8.0, size.x - 370.0),
		max(82.0, size.y - 92.0)
	)

	if portrait:
		controls_label.text = "Mobile Web experimental: use horizontal. Touch minimo: ataque, servo e pocao."
	elif _compact_layout:
		controls_label.text = "Mobile/notebook: Enter/clique iniciar | WASD/setas | 1 ataque | C servo | Q pocao"
	else:
		controls_label.text = "Enter/clique: iniciar/reiniciar | WASD/setas: mover | 1/clique: ataque | C: servo | I: inventario | Q: pocao"
