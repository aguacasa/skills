# Skills

Agent skills for Claude Code.

| Skill | What it does |
|---|---|
| [shopify-d2c-site](shopify-d2c-site/SKILL.md) | Builds a premium, animated D2C storefront on a Shopify theme: brand system, product data and imagery, a 3D hero, scroll-driven sections, product pages that keep the theme's checkout, legal pages, visual QA and safe deploys. |

## Install

Copy a skill folder into `~/.claude/skills/` (or a project's `.claude/skills/`):

```bash
git clone https://github.com/<owner>/skills.git
cp -R skills/shopify-d2c-site ~/.claude/skills/
cd ~/.claude/skills/shopify-d2c-site/scripts && npm install
```

Then ask Claude to "build my Shopify store site" and it will pick the skill up.

## Requirements for shopify-d2c-site
- Claude Code with the Shopify connector
- Node 22+, the Shopify CLI, the GitHub CLI and Google Chrome
- macOS for the product cutout script (Apple Vision); everything else is cross-platform
