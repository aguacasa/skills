# Custom skills

This repository is a public distribution asset and marketing tool. It contains
general-purpose skills for visitors to install and adapt. Author public packages
in `skills/<name>/`, including their references, scripts, and assets.

Personal working skills belong in a separate private folder outside this repo.
Generalize a reviewed copy only when requested. Do not install public versions
over the author's personal versions or use this repo for personal skill storage.

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
