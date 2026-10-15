# Custom skills

This repository is the source of truth for the author's custom skill collection.
Author skills in `skills/<name>/`, including their references, scripts, and assets.
Installed authoring folders should link here instead of becoming separate copies.

- Read the relevant SKILL.md before changing its package. Preserve useful workflow
  knowledge, with optional presets for opinionated styles and private profiles
  for user preferences. Never personalize shared instructions with one user's identity.
- First use offers brief discovery; return visits reuse established preferences;
  users can skip optional setup. Save profiles only when agreed and outside the
  installed skill. Current instructions override profiles and presets.
- Keep vendor plugins and external toolchains under their own installers unless
  explicitly asked to vendor them. Never copy environments or credentials here.
- Validate using `.venv/bin/python scripts/validate_skills.py` after changes; see
  docs/maintaining.md for setup. Use `python3 scripts/link_skills.py --apply` after
  adding a skill. Never overwrite a conflicting installed skill automatically.
- This repository is public. Exclude identities from examples, local paths,
  private conversations, client material, credentials, profiles, footage, and
  generated exports. Preserve required license attribution and repository identity.
- Do not automatically commit or push local edits. Document new skills and clear
  requirements in README.md, which should serve first-time visitors.
