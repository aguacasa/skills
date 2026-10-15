# Useful AI skills. Adapted to you.

Find better content ideas, write scripts that sound like you, edit short videos,
and build a Shopify storefront. These are free, reusable workflows for an AI
assistant, with first-use discovery so they fit your audience, style, and goals.

**Here from a post? Pick the skill you came for below, install it, then paste its
starter prompt.** No signup is required. Star the repo if you want to find it again.

| I want to… | Start here | What you get |
|---|---|---|
| Find things my audience cares about | [Viral Topic Finder](#viral-topic-finder) | Distinct ideas, two hooks per idea, and source-backed demand signals |
| Turn rough thoughts into a recording script | [Video Script](#video-script) | A clear argument, opening hook, and complete spoken script |
| Turn footage into a finished short | [Short Video](#short-video) | A personalized editing workflow with checks and optional style presets |
| Design or improve a Shopify store | [Shopify Site Builder](#shopify-site-builder) | Brand direction, theme implementation, visual QA, and reviewed deployment |

## Start in three steps

1. **Install a skill** in an assistant that supports Agent Skills. In a terminal
   with Node.js available, run:

   ```bash
   npx skills add aguacasa/skills
   ```

   Choose the skill and assistant you want. For one skill across your projects:

   ```bash
   npx skills add aguacasa/skills --skill video-script --global
   ```

   The [skills CLI documentation](https://github.com/vercel-labs/skills) covers
   supported agents and installation choices. Use one installation method per
   skill to avoid duplicate entries.

2. **Open your assistant and paste a starter prompt below.** It may ask a few short
   questions about your audience, goal, style, and setup. It reuses answers already
   in the conversation or an established profile. You can skip optional choices
   and ask it to use sensible defaults.
3. **Make it yours.** Give feedback on the result. Ask it to remember lasting
   preferences in a private profile if you want them reused in later chats.

No terminal? Download this repository using **Code → Download ZIP** on GitHub.
Import the entire selected folder from `skills/` into a host that supports local
or uploaded skills. Keep its references and scripts together; copying only
`SKILL.md` loses required resources. In a chat-only assistant, attach the skill's
instruction and relevant reference files and ask it to follow them. That provides
workflow guidance, not automatic installation or unavailable editing tools.

## Viral Topic Finder

**Start here if you know your niche but need better things to post.**

Researches audience questions and recurring problems, compares candidate ideas,
and returns distinct topics with two hook options, a concrete example, a useful
lesson, and evidence. The default is 25 ideas; request any batch size.

```text
Use the viral-topic-finder skill. Help me set up my audience and content profile,
then find 10 short-form video ideas for my niche. Ask only what you still need.
```

Example request after setup: "Find five topics for a home-organizing business
helping renters with small kitchens. I want useful tips that lead to consultations."

**Needs:** a text assistant and web research for current demand signals. Without
browsing it can use supplied sources or label ideas exploratory. "Viral" is an
ambition, not a performance guarantee.

[Read the skill](skills/viral-topic-finder/SKILL.md) ·
[Share this section](https://github.com/aguacasa/skills#viral-topic-finder)

## Video Script

**Bring a messy thought, voice-note transcript, topic, or draft.**

Develops the argument, hook, and payoff, then delivers one complete recording
script. It adapts to your voice and audience without inventing your experience.
An optional **Direct explainer** preset offers plain language, varied pacing,
practical examples, and restrained humor.

```text
Use the video-script skill. First help me establish my audience, voice, and goal.
Then turn my rough idea into a complete script I can read on camera:
[paste your idea or draft]
```

**Needs:** a text assistant. Research tools are useful when the topic requires
fact-checking. It writes scripts; it does not record, edit, or publish videos.

[Read the skill](skills/video-script/SKILL.md) ·
[See a fictional example](skills/video-script/references/worked-example.md) ·
[Share this section](https://github.com/aguacasa/skills#video-script)

## Short Video

**Bring your footage and choose how you want it to feel.**

Guides source organization, take selection, pacing, audio, graphics, captions,
review, and export. An optional **Clean explainer** preset combines tight natural
cuts, rounded black-and-white text highlights, and navy/light-blue diagrams.
Your colors, caption choices, and project location remain yours to choose.

```text
Use the short-video skill. Help me choose an editing style and check my available
tools before starting. I want a first cut from this footage: [attach footage].
```

**Needs:** an assistant with access to your media and a working rendering toolchain.
This repo contains editorial instructions, not a renderer. You can use an existing
supported editor or separately install the optional
[video-use engine](https://github.com/browser-use/video-use) using its current setup
instructions. Cloud transcription may require an account and incur a cost. A profile
never grants permission to upload your media. Without rendering tools, the assistant
can prepare an edit plan but cannot deliver a finished video.

[Read the skill](skills/short-video/SKILL.md) ·
[Check tool requirements](skills/short-video/references/toolchain.md) ·
[Share this section](https://github.com/aguacasa/skills#short-video)

## Shopify Site Builder

**Bring your product, brand direction, and Shopify store.**

Guides store discovery, a brand system, theme work, product pages, visual checks,
and a reviewed launch. Onboarding covers suppliers, connected services, tracking,
privacy choices, and optional bundles or subscriptions, with Shopify-first
recommendations. Product data and label artwork use explicit fields rather than
supplier-specific description layouts or fixed photo crops. Motion and 3D are optional. The bundled implementation is
an anonymized supplement-store example for a Helio-based theme, not a complete
universal theme. All example products, copy, and asset references need adaptation.

```text
Use the shopify-site-builder skill. Start by learning about my products, customers,
brand, sales regions, and existing theme. Help me plan a preview build before
changing my store.
```

**Needs for execution:** a shell-enabled assistant, authorized Shopify access,
Node.js, Shopify CLI, and Chrome/Chromium for the bundled visual checks. The Apple
Vision cutout helper requires macOS; use another cutout method elsewhere. A text-only
assistant can help plan but cannot deploy. Live deployment requires your approval.

[Read the skill](skills/shopify-site-builder/SKILL.md) ·
[Share this section](https://github.com/aguacasa/skills#shopify-site-builder)

## How personalization works

Each skill checks relevant context before asking questions. On first use it offers
a short discovery step; on return visits it reuses the profile instead of repeating
onboarding. You can change your mind or use a different style for one project.

- **Optional presets** supply starting styles, never someone else's identity.
- **Your private profile** stores preferences, separate from the shared skill.
  A suggested project location is `.skill-profiles/<skill-name>.md`; agree on
  storage before saving. Keep profiles out of public repositories.
- **Remembering is opt-in.** Without a saved file or supported memory, bring the
  profile into your next chat. The assistant must not promise recall it cannot provide.
- **Your current brief wins.** Profiles do not grant upload, publishing, deployment,
  or spending permissions. Never store credentials in them.

This repository ignores `.skill-profiles/`; other projects may need their own ignore
rule. Skill updates should preserve your profile because it lives outside the
installed package.

## Updates and other installation options

For installations made with the skills CLI:

```bash
npx skills list --global
npx skills update video-script --global
```

These list CLI-managed installations and update the named skill. Substitute the
skill you installed, or omit the name to update all skills. See
[the CLI documentation](https://github.com/vercel-labs/skills) for the current
behavior. Copied or uploaded skill folders need replacing manually.

For Claude Code's plugin installation:

```text
/plugin marketplace add aguacasa/skills
/plugin install aguacasa-skills@aguacasa
```

Use `/plugin marketplace update aguacasa` to refresh the marketplace, then use
Claude Code's plugin updater for the installed plugin. Do not also install the
same skill through the CLI. Available tools and behavior depend on the host.

## Sharing and contributing

Share the whole collection or a skill-specific section above. You're welcome to
use and adapt the skills under the [MIT license](LICENSE). They do not guarantee
views, leads, sales, or legal compliance. External tools have their own requirements,
licenses, and costs.

Found a problem or have a useful improvement? [Open an issue](https://github.com/aguacasa/skills/issues).
For local authoring, linked installations, validation, and sync setup, see
[the maintainer guide](docs/maintaining.md).
