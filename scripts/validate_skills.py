#!/usr/bin/env python3
"""Validate skill metadata, entrypoint links, and distribution manifests."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

import yaml

ROOT = Path(__file__).resolve().parents[1]


def validate(root=ROOT):
    errors = []
    skills = sorted((root / "skills").glob("*/SKILL.md"))
    if not skills:
        errors.append("No skills found")
    for folder in (root / "skills").iterdir():
        if folder.is_dir() and not (folder / "SKILL.md").is_file():
            errors.append(f"{folder}: missing SKILL.md")
    names = set()
    for skill in skills:
        content = skill.read_text()
        match = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", content, re.S)
        if not match:
            errors.append(f"{skill}: frontmatter must start on line 1")
            continue
        try:
            meta = yaml.safe_load(match[1])
            assert isinstance(meta, dict), "frontmatter must be a mapping"
            name = meta.get("name", "")
            assert isinstance(name, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name), "invalid name"
            assert len(name) <= 64 and name == skill.parent.name, "name must match folder and be at most 64 characters"
            assert name not in names, "duplicate name"
            names.add(name)
            assert isinstance(meta.get("description"), str) and meta["description"].strip(), "missing description"
        except (yaml.YAMLError, AssertionError) as exc:
            errors.append(f"{skill}: {exc}")
        # Entrypoints must link to resources that actually ship with the skill.
        for link in re.findall(r"\]\(([^)]+)\)", content):
            link = link.split("#", 1)[0]
            if not link or urlparse(link).scheme or link.startswith("/"):
                continue
            target = skill.parent / unquote(link)
            if not target.exists():
                errors.append(f"{skill}: missing linked resource {link}")
    for manifest in (root / ".claude-plugin").glob("*.json"):
        try:
            json.loads(manifest.read_text())
        except (ValueError, OSError) as exc:
            errors.append(f"{manifest}: {exc}")
    for error in errors:
        print(error, file=sys.stderr)
    print(f"Checked {len(skills)} skills; {len(errors)} errors.")
    return bool(errors)


if __name__ == "__main__":
    sys.exit(validate())
