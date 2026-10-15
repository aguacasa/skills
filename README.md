# Skills

Custom agent skills by [aguacasa](https://github.com/aguacasa). Each one is a folder with a `SKILL.md`, in the open [Agent Skills](https://agentskills.io) format, so the same files work in Claude Code, Claude.ai, Codex, Cursor, GitHub Copilot, Gemini CLI and other agents that read skills.

| Skill | What it does |
|---|---|
| [shopify-site-builder](skills/shopify-site-builder/SKILL.md) | Builds a premium, animated D2C storefront on a Shopify theme: brand system, product data and imagery, a 3D hero, scroll-driven sections, product pages that keep the theme's checkout, legal pages, visual QA and safe deploys. |

## Install

### Any agent (recommended)

```bash
npx skills add aguacasa/skills
```

The [skills CLI](https://github.com/vercel-labs/skills) finds every skill in this repo and installs it for whichever agents you pick. Useful flags: `-g` installs globally instead of for the current project, `-s shopify-site-builder` installs one skill, `-a claude-code` targets one agent, and `-l` lists the skills without installing.

### Claude Code plugin

Inside Claude Code:

```
/plugin marketplace add aguacasa/skills
/plugin install aguacasa-skills@aguacasa
```

This installs every skill in the repo as one plugin. Each skill becomes a command named after the plugin, such as `/aguacasa-skills:shopify-site-builder`. Claude also loads a skill on its own when your request matches the skill's description. To pull in new skills later, run `/plugin marketplace update aguacasa`.

### Manual copy

Copy a skill folder into your agent's skills directory:

```bash
git clone https://github.com/aguacasa/skills.git
cp -R skills/skills/shopify-site-builder ~/.claude/skills/
```

| Agent | Personal folder | Project folder |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex | `~/.agents/skills/` | `.agents/skills/` |
| Cursor | `~/.cursor/skills/` or `~/.agents/skills/` | `.cursor/skills/` or `.agents/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.github/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/` |

In Claude Code, a skill in `~/.claude/skills/<name>/` runs as `/<name>`, for example `/shopify-site-builder`.

### Claude.ai

1. Zip the skill folder, keeping the folder at the top level of the zip:

   ```bash
   cd skills && zip -r shopify-site-builder.zip shopify-site-builder -x '*/node_modules/*'
   ```

2. Turn on **Code execution and file creation** in Settings → Capabilities.
3. Upload the zip under **Skills**.

The shopify-site-builder skill needs a local shell, the Shopify CLI and Chrome. On Claude.ai it can plan and write code, but it can't deploy.

## Adding a skill

1. Create `skills/<skill-name>/SKILL.md`. Copy [docs/new-skill-template.md](docs/new-skill-template.md) to start. The folder name must match the `name` in the frontmatter: lowercase letters, numbers and hyphens.
2. Write a `description` that says what the skill does and when to use it. Agents read only this field when deciding whether to load the skill.
3. Keep `SKILL.md` short. Put long material in `references/` and helper code in `scripts/`.
4. Use only these frontmatter keys so the skill works everywhere: `name`, `description`, `license`, `compatibility`, `metadata` and `allowed-tools`.
5. Add a row to the table above, then commit and push.

You don't need any other manifest. The skills CLI and the Claude Code plugin both pick up every folder under `skills/`.

## Requirements for shopify-site-builder

- An agent with a shell, and the Shopify connector (MCP) for store data
- Node 22+, the Shopify CLI, the GitHub CLI and Google Chrome
- macOS for the product cutout script, which uses Apple Vision. Everything else is cross-platform.
- Run `npm install` in `skills/shopify-site-builder/scripts/` once before using the QA scripts.

## License

[MIT](LICENSE)
