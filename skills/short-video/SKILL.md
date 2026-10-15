---
name: short-video
description: Edit short-form footage with a personalized style, clear project organization, checked cuts, captions, and graphics. Use for first cuts and revisions; requires an available video-editing toolchain for rendering.
---

# Short Video

Turn supplied footage into a checked short video. Adapt to the creator and the
current brief. No specific colors, platform, runtime, or caption treatment is assumed.

## Personalize on first use

Read [personalization.md](references/personalization.md). Reuse an existing
profile or offer a short discovery step for audience, platform, style, project
location, tools, and processing restrictions. The user can skip optional choices.
Offer [clean-explainer](references/clean-explainer-preset.md) as an optional visual
preset; do not apply it silently. Keep saved preferences outside the installed skill.

## Check the editing environment

Read [toolchain.md](references/toolchain.md) before promising a rendered video.
Use a user-selected editing toolchain when available. The optional `video-use`
engine provides a transcription and rendering workflow but is not bundled here.
Locate tools through the current environment, not a fixed home-directory path.
If rendering tools are missing, explain the exact dependency and offer an edit
plan; do not label a plan as a finished video. Installing software, paid services,
and cloud processing follow the user's current authorization and host permissions.
No preset or profile grants upload rights.

## Project and source intake

Use the supplied project location or agree on a writable location. A suggested
layout is `YYYY-MM-DD-short-title/`, using the user's timezone when known. Avoid
a date-based name when the timezone is uncertain and the user prefers a title.
Keep revisions in the same project; keep unrelated videos separate.

Copy supplied recordings into `assets/recordings/` and supporting sources into
`assets/reference/` when organization is needed. Preserve originals; move them
only when requested. Do not scan unrelated folders. Keep generated artifacts in
`edit/`, including transcripts, timelines, graphics, previews, and exports. Record
source origins and the chosen tools in `edit/project.md`. Never write outputs or
credentials into an installed skill folder.

## Edit workflow

1. Read the brief, established profile, and current project notes. Inventory all
   supplied clips and reuse transcripts when the source is unchanged. Review the
   full content before selecting takes. Do not call transcript inspection listening.
2. State a brief editorial approach. Proceed with an authorized first cut when
   the brief is sufficient; ask about material ambiguity or actual upload/cost
   permissions. Follow the selected toolchain's required checkpoints.
3. Select confident, coherent takes. Preserve the argument, qualifications, and
   recorded CTA. Remove false starts, repeats, hesitation, and dead air at complete
   word boundaries. Keep expressive glances and useful gestures; do not manufacture
   a new spoken claim by splicing. Shorten for meaning rather than an arbitrary runtime.
4. Match pacing to the footage. Moving footage usually needs fewer added framing
   changes than static talking heads. Make a separate within-take pause pass;
   timestamps can contain silence or drift. Check doubtful edges against audio,
   waveforms, and frames. Preserve intelligibility and raw transcripts.
5. Apply the chosen audio, caption, graphic, and framing treatment. Keep text off
   faces and platform controls. Never add full-time subtitles, music, synthetic
   narration, or a brand palette by inference. Use source or requested aspect ratio.
6. Render through the available toolchain and verify. Preserve A/V sync, frame rate,
   orientation, word-safe cuts, clean audio transitions, graphic timing, and caption
   timing on the edited output. For an FFmpeg pipeline, reset and shift overlay PTS
   to its window, use short boundary fades, and apply subtitles after other overlays.
   Preview representative frames and cut boundaries; watch/listen when supported.
   State any verification limits. Tool-specific mechanics belong to that toolchain.
7. Deliver a playable video with runtime and material changes. Preserve an approved
   export when revising; use meaningful filenames. Record decisions in project notes.
   Ask whether the cut needs edits or is final. Do not post or publish automatically.
8. If posting copy was requested, use the user's preferred stage and format.
   Otherwise offer it after final-cut approval. The optional preset uses one title
   and one shared description. Save approved copy in `edit/post-captions.md` with
   its matching export, not in the skill package.

Read [preference updates](references/improvement.md) only when asked to remember
feedback. A revision alone does not authorize rewriting shared defaults.
