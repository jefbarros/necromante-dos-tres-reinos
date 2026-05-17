#!/usr/bin/env python3
"""Static audit for the Godot project.

No external dependencies. Run from repository root:
    python tools/audit_godot_project.py
"""

from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GODOT_ROOT = ROOT / "godot"
REPORT_PATH = ROOT / "docs" / "qa" / "AUDIT_GODOT_PROJECT.md"

TEXT_EXTENSIONS = {".gd", ".tscn", ".tres", ".godot"}
RESOURCE_EXTENSIONS = {".gd", ".tscn", ".tres", ".res", ".godot"}

LOAD_RE = re.compile(r'\b(?:preload|load)\("res://([^"]+)"\)')
EXT_RESOURCE_RE = re.compile(r'\[ext_resource[^\]]*path="res://([^"]+)"[^\]]*id="?(.*?)"?\]')
PACKED_SCENE_EXT_RE = re.compile(
    r'\[ext_resource[^\]]*type="PackedScene"[^\]]*path="res://([^"]+\.tscn)"[^\]]*id="?(.*?)"?\]'
)
SCRIPT_EXT_RE = re.compile(r'script\s*=\s*ExtResource\("?(.*?)"?\)')
TARGET_SCENE_EXT_RE = re.compile(r'target_scene\s*=\s*ExtResource\("?(.*?)"?\)')
TARGET_SCENE_PACKED_EXPORT_RE = re.compile(r'@export\s+var\s+target_scene\s*:\s*PackedScene')
CHANGE_SCENE_PACKED_TARGET_RE = re.compile(r'change_scene_to_packed\(\s*target_scene\s*\)')
CLASS_NAME_RE = re.compile(r'^\s*class_name\s+([A-Za-z_][A-Za-z0-9_]*)', re.MULTILINE)
CONNECT_RE = re.compile(r'\.connect\((?:Callable\(self,\s*)?"([^"]+)"|\.connect\(([A-Za-z_][A-Za-z0-9_]*)')
FUNC_RE = re.compile(r'^\s*func\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(', re.MULTILINE)
GENERIC_INFER_RE = re.compile(
    r'^\s*var\s+([A-Za-z_][A-Za-z0-9_]*)\s*:=\s*'
    r'((?:load|preload)\(|.*\.instantiate\(|get_tree\(\)\.get_first_node_in_group\()',
    re.MULTILINE,
)
NODE_PATH_RE = re.compile(r'(?<![\w$])\$([A-Za-z_][A-Za-z0-9_/]*)')
NODE_TAG_RE = re.compile(r'\[node[^\]]*name="([^"]+)"(?:[^\]]*parent="([^"]+)")?')

TRANSITION_MAP_SCENES = {
    "scenes/hub/Hub_VeyrholdOutskirts.tscn",
    "scenes/world/FronteiraCinzas_PrototypeArea.tscn",
    "scenes/world/PrototypeArena3D.tscn",
    "scenes/dungeons/MiniDungeon_CryptOfVeyrfall.tscn",
}


def res_to_path(res_path: str) -> Path:
    return GODOT_ROOT / res_path


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1")


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def scene_nodes(text: str) -> set[str]:
    nodes = {"."}
    for match in NODE_TAG_RE.finditer(text):
        name = match.group(1)
        parent = match.group(2) or "."
        if parent == ".":
            nodes.add(name)
        else:
            nodes.add(f"{parent}/{name}")
    return nodes


def main() -> int:
    files = [p for p in GODOT_ROOT.rglob("*") if p.is_file() and p.suffix in RESOURCE_EXTENSIONS]
    gd_files = [p for p in files if p.suffix == ".gd"]
    scene_files = [p for p in files if p.suffix == ".tscn"]
    tres_files = [p for p in files if p.suffix in {".tres", ".res"}]
    godot_files = [p for p in files if p.suffix == ".godot"]

    broken_paths: list[str] = []
    scene_script_issues: list[str] = []
    risky_inference: list[str] = []
    possible_signal_issues: list[str] = []
    possible_node_issues: list[str] = []
    transition_dependency_issues: list[str] = []
    class_names: dict[str, list[str]] = defaultdict(list)

    for path in files:
        if path.suffix not in TEXT_EXTENSIONS:
            continue
        text = read_text(path)

        for match in LOAD_RE.finditer(text):
            target = match.group(1)
            if not res_to_path(target).exists():
                broken_paths.append(f"- `{rel(path)}` references missing `res://{target}`")

        ext_resources = {}
        if path.suffix == ".tscn":
            for match in EXT_RESOURCE_RE.finditer(text):
                target, resource_id = match.groups()
                ext_resources[resource_id] = target
                if not res_to_path(target).exists():
                    broken_paths.append(f"- `{rel(path)}` ext_resource missing `res://{target}`")

            for match in PACKED_SCENE_EXT_RE.finditer(text):
                target, resource_id = match.groups()
                source_scene = rel(path).removeprefix("godot/")
                if source_scene in TRANSITION_MAP_SCENES and target in TRANSITION_MAP_SCENES:
                    transition_dependency_issues.append(
                        f"- `{rel(path)}` has map-to-map PackedScene ExtResource `{resource_id}` -> `res://{target}`"
                    )

            for match in TARGET_SCENE_EXT_RE.finditer(text):
                resource_id = match.group(1)
                target = ext_resources.get(resource_id, "<unknown>")
                transition_dependency_issues.append(
                    f"- `{rel(path)}` assigns transition `target_scene = ExtResource(\"{resource_id}\")` -> `res://{target}`"
                )

            for match in SCRIPT_EXT_RE.finditer(text):
                resource_id = match.group(1)
                target = ext_resources.get(resource_id)
                if target is None:
                    scene_script_issues.append(f"- `{rel(path)}` has script ExtResource `{resource_id}` not declared")
                elif not res_to_path(target).exists():
                    scene_script_issues.append(f"- `{rel(path)}` script file missing `res://{target}`")

            nodes = scene_nodes(text)
            for node_path in NODE_PATH_RE.finditer(text):
                target = node_path.group(1)
                if target not in nodes:
                    possible_node_issues.append(
                        f"- `{rel(path)}` has possible missing `$` path `{target}`"
                    )

        if path.suffix == ".gd":
            if TARGET_SCENE_PACKED_EXPORT_RE.search(text):
                transition_dependency_issues.append(
                    f"- `{rel(path)}` exports `target_scene: PackedScene`; use `target_scene_path` instead"
                )
            if CHANGE_SCENE_PACKED_TARGET_RE.search(text):
                transition_dependency_issues.append(
                    f"- `{rel(path)}` calls `change_scene_to_packed(target_scene)` in transition code"
                )

            for class_match in CLASS_NAME_RE.finditer(text):
                class_names[class_match.group(1)].append(rel(path))

            for match in GENERIC_INFER_RE.finditer(text):
                risky_inference.append(f"- `{rel(path)}` uses `:=` with generic expression `{match.group(2)}`")

            funcs = set(FUNC_RE.findall(text))
            for match in CONNECT_RE.finditer(text):
                method = match.group(1) or match.group(2)
                if method and method.startswith("_") and method not in funcs:
                    possible_signal_issues.append(
                        f"- `{rel(path)}` connects possible missing method `{method}`"
                    )

    duplicate_classes = [
        f"- `{name}` in {', '.join(paths)}"
        for name, paths in sorted(class_names.items())
        if len(paths) > 1
    ]

    report = [
        "# Godot Project Audit",
        "",
        "Generated by `tools/audit_godot_project.py`.",
        "",
        "## Inventory",
        f"- `.gd`: {len(gd_files)}",
        f"- `.tscn`: {len(scene_files)}",
        f"- `.tres/.res`: {len(tres_files)}",
        f"- `.godot`: {len(godot_files)}",
        f"- Total scanned resources: {len(files)}",
        "",
        "## Missing `res://` References",
        *(broken_paths or ["- None detected."]),
        "",
        "## Scene Script Issues",
        *(scene_script_issues or ["- None detected."]),
        "",
        "## Duplicate `class_name`",
        *(duplicate_classes or ["- None detected."]),
        "",
        "## Risky Generic `:=` Inference",
        *(risky_inference or ["- None detected."]),
        "",
        "## Possible Missing Signal Methods",
        *(possible_signal_issues or ["- None detected."]),
        "",
        "## Possible Missing `$NodePath` References In Scenes",
        *(possible_node_issues or ["- None detected."]),
        "",
        "## Scene Transition Dependency Risks",
        *(transition_dependency_issues or ["- None detected."]),
        "",
        "## Notes",
        "- This is a static audit. Godot CLI validation remains authoritative for parser/import errors.",
        "- Signal and `$NodePath` checks are conservative and may include false positives.",
    ]

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Wrote {REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
