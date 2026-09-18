# Grandline — Design Language

High-level visual and verbal flavor for Grandline. This is the source of truth for **how the product should feel**. Product behavior lives in [Grandline_Context.md](Grandline_Context.md); vision lives in [Grandline_Concept.md](Grandline_Concept.md).

**Scope:** Shared brand for the player app, with a short admin variant. The player app *is* the brand; admin borrows the same materials at a quieter volume.

---

## Personality

Grandline is **race-day energy inside a quiet, modern-minimal shell**.

It should feel like a well-made sports watch, not a game, not a social feed, and not a dashboard. The map is the stage. Chrome, type, and color exist to make progress, time, and the next action obvious — then get out of the way.

| It is | It is not |
| --- | --- |
| Athletic, timed, outdoor | Gamified, neon, sticker-covered |
| Utility-first, glanceable | Decorative, skeuomorphic, cinematic HUD |
| Warm and physical (dust, sun, pulse) | Cold corporate blue, or candy fitness |
| Confident and spare | Chatty, meme-y, or nautical-costume |

**One-liner:** *A calm navigator that catches fire at the start line.*

---

## Color

**Story:** Warm race-day. Charcoal structure, sun-baked surfaces, one ember accent. Light-first so HUD and sheets stay readable on a bright map in outdoor sun.

Named roles (use these names in code and conversation). Hexes are examples — keep the roles even if values shift slightly.

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary | **Ink** | `#1C1917` | Text, icons, quiet primary controls (auth, settings, admin structure) |
| Secondary | **Stone** | `#78716C` | Secondary text, inactive checkpoints, hairline chrome |
| Surface | **Paper** | `#FAFAF9` | Screens that are not the map; sheet/HUD fill at high opacity |
| Surface muted | **Sand** | `#F5F0EB` | Chips, selected rows, subtle wells |
| Tertiary / accent | **Ember** | `#E85D04` | Race-critical CTAs, LIVE, “you”, focus on the current checkpoint |
| On-accent | **Ember ink** | `#FFF7ED` | Text/icons on Ember |
| Success | **Mark** | `#15803D` | Checkpoint complete, finished, positive confirm |
| Danger | **Flare** | `#C2410C` | Errors, DNF, destructive — warm, not candy red |

**HUD on map:** Paper at ~92% opacity (`rgba(250, 250, 249, 0.92)`), Ink type, Ember only for status that must punch through (LIVE, Start Race). Do not flood the map with accent.

**Do**

- One accent at a time in a view.
- Let the map carry most of the color (terrain, sky, water).
- Dim completed checkpoints toward Stone; emphasize the current target with Ember.

**Don’t**

- Default to generic `#0066cc` / pure black / `#c00` — those were scaffolding.
- Use Ember as a large fill background.
- Introduce a second brand accent (teal, electric blue, lime) without a named role.

---

## Type and icons

- **UI type:** System fonts only (`system-ui` / San Francisco / Roboto). No custom display face.
- **Hierarchy, not personality:** Elapsed time is the loudest number; race name is secondary; captions stay Stone.
- **Weights:** Regular for body, semibold for actions, bold for live time and placement.
- **Icons:** Simple geometric strokes. Run / bike / trophy / invite should read at small sizes on the map and in the sheet. No mascots, no illustrated stickers.

---

## Motion

Default is still. The map and the clock do the living.

**Athletic punctuation** — reserved, stronger beats, not decoration:

- **Start Race:** short, decisive (sheet commits, HUD locks in).
- **Checkpoint:** a clear confirm, then settle.
- **Finish / placement:** the one moment that may linger.

No looping attention-grabbers, no parallax, no confetti. If motion does not mark a race-state change, skip it.

---

## Voice

**Default: calm navigator.** Clear, spare, present tense. Google Maps energy: *Start race. 1.2 km to next checkpoint. Center map.*

**Race-day coach** only at the punctuation moments (start, last checkpoint, finish, placement). Direct, timed, a little fire — still short. Never cheerleading paragraphs.

| Do | Don’t |
| --- | --- |
| Start race | Let’s do this!! |
| Checkpoint 3 of 5 | You’re crushing it |
| Finished · 1:12:04 · 2nd | Wow what a legend |

---

## Player app (canonical)

The map is home. Layout, HUD, and sheet behavior: [Grandline_Context.md](Grandline_Context.md).

Visual rules that belong here:

- High contrast Ink on Paper; large touch targets.
- Minimal chrome over the map; avoid stacked cards and floating junk.
- Light UI on a bright map. No dark theme in this document; add it later if night racing needs it.
- Bottom sheet and top HUD are Paper, not Ember, not glass-dark.

---

## Admin variant

Same Ink / Stone / Paper / Ember family. Admin is a **tool**, not the race.

- Denser type and tables; system fonts; no HUD metaphors.
- Ember for primary actions (Save, Create race), not for decoration or page backgrounds.
- Sand for selected rows and filters; Flare for delete.
- Stay visually quieter than the player app so operators do not feel “in a game.”

---

## Applying this

When adding or restyling UI: named color roles first, then hex; system type; Ember only when the action or state is race-critical (player) or the primary verb (admin). If a screen looks busy on the map, remove chrome before adding color.
