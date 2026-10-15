#!/usr/bin/env python3
"""Link repo skills into Codex and Claude; never overwrite divergent content."""
import argparse
import hashlib
import os
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fingerprint(folder):
    entries = {}
    for path in sorted(folder.rglob("*")):
        relative = str(path.relative_to(folder))
        if path.is_symlink():
            entries[relative] = ("link", os.readlink(path))
        elif path.is_file():
            entries[relative] = ("file", hashlib.sha256(path.read_bytes()).hexdigest(), path.stat().st_mode & 0o111)
        elif path.is_dir():
            entries[relative] = ("dir",)
    return entries


def sync(root, home, apply=False, adopt=False):
    plans = []
    conflicts = []
    for source in sorted((root / "skills").iterdir()):
        if not (source / "SKILL.md").is_file():
            continue
        # Preserve an existing legacy Codex location without creating a duplicate
        # name in .agents. New installs use the documented .agents location.
        legacy = home / ".codex/skills" / source.name
        codex = legacy if os.path.lexists(legacy) else home / ".agents/skills" / source.name
        targets = [codex, home / ".claude/skills" / source.name]
        other = home / ".agents/skills" / source.name
        if codex == legacy and os.path.lexists(other):
            conflicts.append(f"Duplicate Codex installation: {legacy} and {other}; resolve manually")
        for target in targets:
            if target.is_symlink() and target.resolve() == source.resolve():
                continue
            exists = os.path.lexists(target)
            if exists and not (adopt and target.is_dir() and not target.is_symlink() and fingerprint(target) == fingerprint(source)):
                conflicts.append(f"Conflicting installation: {target}")
                continue
            plans.append((source, target, exists))
    if conflicts:
        print("\n".join(conflicts), file=sys.stderr)
        print("No installations changed.", file=sys.stderr)
        return 1
    backup = home / ".local/state/aguacasa-skills/backups" / datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    for source, target, exists in plans:
        print(f"{'Link' if apply else 'Would link'} {target} -> {source}")
        if apply:
            target.parent.mkdir(parents=True, exist_ok=True)
            if exists:
                saved = backup / target.relative_to(home)
                saved.parent.mkdir(parents=True, exist_ok=True)
                target.rename(saved)
                print(f"Backup: {saved}")
            target.symlink_to(source.resolve(), target_is_directory=True)
    print(f"{len(plans)} links {'updated' if apply else 'planned'}.")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Create links; default is preview only")
    parser.add_argument("--adopt-identical", action="store_true", help="Back up and replace byte-identical installed directories")
    args = parser.parse_args()
    sys.exit(sync(ROOT, Path.home(), args.apply, args.adopt_identical))
