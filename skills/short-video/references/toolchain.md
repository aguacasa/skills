# Rendering requirements

This skill supplies editorial workflow and personalization. It does not contain a
video renderer, transcription service, fonts, or example footage.

## Use an existing toolchain

Use the editing environment the user already has when it supports the requested
output. Check local paths, supported export formats, transcription availability,
and a small render before promising full delivery. A toolchain can be local or
connected; confirm actual access rather than assuming an app is installed.

## Optional video-use engine

[video-use upstream](https://github.com/browser-use/video-use) provides a separate
conversation-driven editing workflow. Review its current README and installation
instructions before installing it; this repo does not pin or vendor that engine.
An existing modified installation may differ from upstream.

When selected, locate its installed SKILL.md through the host's skill list or a
user-supplied location, read it, and resolve helpers relative to that directory.
Follow its setup and production safeguards. It may require FFmpeg, Python
dependencies, and credentials for its selected transcription service. Keep keys
in the user's private environment or secret store, never in this skill or profile.

## Cloud processing

Explain which supplied media would leave the machine, to which service, and any
known cost before an upload unless the current session already authorizes it.
Respect a local-only restriction and the host's permission rules. A saved style
profile is never evidence of upload consent. If no permitted transcription path
exists, use user-supplied transcripts or explain what remains blocked.
