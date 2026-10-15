# Maintaining the collection

Author custom skills in `skills/<name>/`, with all required references, helpers,
and assets. Keep frontmatter on line 1. Start from [the template](new-skill-template.md).
Descriptions should identify a task and useful boundary, not a particular person.

Every public skill must support first-use discovery and returning-user profiles.
Keep its personalization instructions self-contained so one folder installs by
itself. Save user preferences outside installed packages. Presets may preserve
reusable style choices but must not contain identities, biographies, client
material, machine paths, private conversations, or remembered service consent.

## Linked local installations

This checkout can be the source of truth for authoring. From the repo root:

```bash
python3 scripts/link_skills.py
python3 scripts/link_skills.py --apply
```

New Codex installs use `~/.agents/skills/`; existing legacy installs keep
`~/.codex/skills/` to avoid duplicate names. Claude Code uses `~/.claude/skills/`.
The linker refuses conflicting content before changing installations. During a
first migration, `--apply --adopt-identical` backs up byte-identical directories
under `~/.local/state/aguacasa-skills/backups/` and replaces them with links.
It does not overwrite other installers' links or different files.

Inspect existing hook configuration before enabling this repo's hooks:

```bash
git config --get core.hooksPath
git config --local core.hooksPath .githooks
```

Combine hooks if a previous setup exists. Included hooks link newly added skills
after commits, merges, and checkouts; editing an already-linked file needs no sync.
Run the link helper for a new skill before committing if needed. Remove obsolete
installed links manually when renaming or deleting a skill.

## Validate and publish

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r scripts/requirements.txt
.venv/bin/python scripts/validate_skills.py
.venv/bin/python -m unittest discover -s scripts -p 'test_*.py'
```

Review frontmatter, local links, first-use/returning-user behavior, skipped setup,
and individual skill installation. A discovery questionnaire must not become
permission to upload, spend, deploy, or publish. Inspect all newly added examples
and assets before publishing. Do not commit profiles, credentials, source footage,
private transcripts, or generated exports. Public attribution and repository URLs
belong in distribution metadata, not a user's voice or personalization profile.

GitHub Actions runs package validation and the link-helper tests on pushes and PRs.
Commit and push reviewed changes when requested; local skill edits are immediately
visible through links, while GitHub receives only pushed commits. Keep vendor
plugins and external rendering engines under their own installers. This repo does
not automatically update those dependencies.

For automatic refreshes on another machine, schedule a clean-tree check,
`git pull --ff-only`, and the linker. Report dirty files, divergence, network
failures, or installation conflicts; stay quiet when nothing changes. No scheduled
job is enabled by these files. Avoid unattended public commit-and-push.
