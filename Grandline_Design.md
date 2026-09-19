# Grandline — Design Language

High-level visual and verbal flavor for Grandline, plus the v1 UI system designed from it. This is the source of truth for **how the product should feel**. Product behavior lives in [Grandline_Context.md](Grandline_Context.md); vision lives in [Grandline_Concept.md](Grandline_Concept.md).

**Scope:** Shared brand for the player app, with a short admin variant. The player app *is* the brand; admin borrows the same materials at a quieter volume.

**Canvas:** [Grandline UI (Figma)](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI) — live frames, variables, and components. Snapshots for git: [docs/design](docs/design/README.md). If a mock and this document disagree on *feel*, this document wins. If they disagree on *layout of a shipped screen*, Figma wins until this file is updated.

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

Named roles (use these names in code and conversation). Hexes are the v1 values in Figma variables.

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary | **Ink** | `#1C1917` | Text, icons, quiet primary controls (auth, settings, admin structure) |
| Secondary | **Stone** | `#78716C` | Secondary text, inactive checkpoints, hairline chrome |
| Surface | **Paper** | `#FAFAF9` | Screens that are not the map; sheet/HUD fill at high opacity |
| Surface muted | **Sand** | `#F5F0EB` | Chips, selected rows, subtle wells, roads on the map |
| Tertiary / accent | **Ember** | `#E85D04` | Race-critical CTAs, LIVE, “you”, focus on the current checkpoint |
| On-accent | **Ember ink** | `#FFF7ED` | Text/icons on Ember |
| Success | **Mark** | `#15803D` | Checkpoint complete, finished, positive confirm |
| Danger | **Flare** | `#C2410C` | Errors, DNF, destructive — warm, not candy red |
| Rule | **Hairline** | `#E7E5E4` | 1px chrome, sheet rim, input rest state — not Stone |
| Map land | **Map land** | `#E8DFD4` | Terrain under chrome (Figma stand-in; live map is real tiles) |
| Map water | **Map water** | `#C9D4D0` | Water on the stand-in map — natural, not a second brand accent |
| Map park | **Map park** | `#D5DCC8` | Vegetation on the stand-in map |

**HUD on map:** Paper at 92% opacity (`--opacity-hud`), Ink type, Ember only for status that must punch through (LIVE, Start Race). Do not flood the map with accent.

**Do**

- One accent at a time in a view.
- Let the map carry most of the color (terrain, sky, water).
- Dim completed checkpoints toward Stone / Mark; emphasize the current target with an Ember ring.
- Use Hairline for structure. Stone is for type and inactive marks, not boxes.

**Don’t**

- Default to generic `#0066cc` / pure black / `#c00` — those were scaffolding. The current apps still use them; restyle to these roles.
- Use Ember as a large fill background (cover, sheets, drawers, admin chrome).
- Introduce a second brand accent (teal, electric blue, lime) without a named role.
- Use a blue focus ring. Focus is Ember. Error is Flare.

**Semantic tokens (Figma Color collection, Light only):** `text/primary`, `text/secondary`, `text/on-accent`, `text/accent`, `text/success`, `text/danger`, `bg/page`, `bg/muted`, `bg/accent`, `bg/inverse`, `border/default`, `border/strong`, `icon/*`, `map/*`. No dark theme in v1.

---

## Type and icons

- **UI type:** System fonts only (`system-ui` / San Francisco / Roboto). No custom display face.
- **Figma stand-in:** Inter (Regular / Semi Bold / Bold). Implement with the platform UI font, not Inter, unless Inter is already shipping.
- **Hierarchy, not personality:** Elapsed time is the loudest number; race name is secondary; captions stay Stone.
- **Weights:** Regular for body, semibold for actions, bold for live time and placement.
- **Icons:** Simple geometric strokes. Run / bike / trophy / invite should read at small sizes on the map and in the sheet. No mascots, no illustrated stickers. Menu is three strokes, 18px.

### Type ramp

| Style | Size / line | Weight | Use |
| --- | --- | --- | --- |
| **Time** | 32 / 36, tracking −0.4 | Bold | Elapsed clock — the loudest number |
| **Placement** | 28 / 32 | Bold | Finish rank only (`2nd`) |
| **Title** | 20 / 26 | Semibold | Race name, screen title |
| **Action** | 16 / 22 | Semibold | Buttons, list names, emphasis |
| **Body** | 16 / 22 | Regular | Primary reading |
| **Caption** | 13 / 18 | Regular | HUD support, helpers, table meta |
| **Overline** | 11 / 14, tracking +0.8 | Semibold | `LIVE` / `WAITING` / `FINISHED`, `GRANDLINE` |
| **Admin/Title** | 18 / 24 | Semibold | Admin headings — denser than player Title |
| **Admin/Body** | 14 / 20 | Regular | Tables |
| **Admin/Meta** | 12 / 16 | Regular | Invite codes, timestamps |

Player type is glanceable at arm’s length on a bright map. Admin type is denser so operators do not feel “in a game.”

---

## Space, radius, touch

4pt grid. Prefer removing chrome over tightening type.

| Token | Value | Use |
| --- | --- | --- |
| `space/4` … `space/48` | 4, 8, 12, 16, 24, 32, 48 | Gaps and padding |
| `radius/sm` | 8 | Mode chips, admin selected nav |
| `radius/md` | 12 | HUD, buttons, inputs, leaderboard rows |
| `radius/lg` | 16 | Bottom sheet top corners |
| `radius/pill` | 999 | Status chips only |
| `size/touch` | 48 | Race-critical and auth primary buttons (Action) |
| Compact control | 36 | Admin primary, dense tools |
| HUD inset | 16 | From screen left/right, below status bar |
| Sheet side pad | 20 | Sheet content |

No drop shadows as brand. Lift comes from Paper on the map plus a Hairline rim. The sports-watch shell is cut, not floated.

---

## Motion

Default is still. The map and the clock do the living.

**Athletic punctuation** — reserved, stronger beats, not decoration:

- **Start Race:** short, decisive (sheet commits, HUD locks in, WAITING → LIVE).
- **Checkpoint:** a clear confirm (`Checkpoint 2 complete` in Mark), then settle.
- **Finish / placement:** the one moment that may linger (time + `2nd` on the sheet).

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
| The map is waiting. | Welcome to Grandline!! |
| 1.2 km to next checkpoint | You’re 1.2 km from glory |
| Center map | Recenter on me |
| Opens in 14m | Get ready to crush it |
| Paid races require a beta pass. | Unlock the premium adventure |

**Brand mark in UI:** a 28×4 Ember tick, then overline `GRANDLINE` in Stone. Never a logo lockup, wave, or compass rose.

---

## Chrome (player)

The current code uses a full-width white HUD bar and a shadowed sheet. v1 design replaces that with less metal on the map.

### HUD

Floating Paper card, 358×~88, 16px inset, 12px radius, 92% opacity. Menu (three strokes) lives *inside* the HUD — not a second floating circle. Structure: menu · copy · status chip.

| Slot | Content | Type |
| --- | --- | --- |
| Race | Race name, one line | Caption / Stone |
| Time | Elapsed, or `0:00` pre-race | Time / Ink |
| Progress | `Checkpoint 3 of 5` / `Opens 09:00` / `2nd · 48 finishers` | Caption / Stone |
| Chip | `WAITING` Sand+Stone · `LIVE` Ember · `FINISHED` Sand+Mark | Overline |

Evidence: [docs/design/exports/hud.png](docs/design/exports/hud.png) · [Figma HUD](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-269)

### Bottom sheet

Paper, 16px top radius, Hairline top edge, no drop shadow. Handle 36×4 Hairline. Peek is the handle plus optional race name; expanded holds the state-specific verb.

| State | Sheet says | Primary |
| --- | --- | --- |
| Waiting | Race title, distance, Run/Bike chips, `Opens in 14m` | Ember **Start race** |
| Live | `1.2 km` / `to next checkpoint` / Mark confirm | Ghost **Center map** |
| Finished | `Finished` · time · **2nd** · finisher count | Ember **View leaderboard** |

Center map is Ghost (Paper, Hairline, Ink) — never Ember. Ember is reserved for starting and for the post-race verb.

### Markers

| Kind | Look |
| --- | --- |
| **You** | 16px Ember disc, Paper ring |
| **Next** | 32px Paper, Ember ring 2.5px, Ink number |
| **Open** | 28px Paper, Hairline, Stone number |
| **Done** | 28px Paper, Mark ring, check, ~70% opacity |
| **Finish** | Geometric Ember flag — only when the last checkpoint is the target |

---

## Components

Buttons, chips, inputs, markers, HUD: [Components page](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-55).

**Button kinds**

| Kind | Fill | When |
| --- | --- | --- |
| Ember | Ember / Ember ink | Race-critical: Start race, Join, View leaderboard, Create race |
| Quiet | Ink / Ember ink | Auth Continue, structural primary off the map |
| Ghost | Paper + Hairline / Ink | Secondary on the map (Center map) |
| Flare | Flare / Ember ink | Destroy only if it is the screen’s verb; prefer Flare *text* for row Delete / Log out |

Sizes: **Action** 48pt (player), **Compact** 36pt (admin).

**Chip:** LIVE / WAITING / FINISHED are status. Run / Bike are Sand + Ink — not Ember.

**Input:** Paper well, Hairline rest, Ember ring on focus, Flare ring + Flare helper on error. Never a blue caret ring.

---

## Screens

Phone frame 390×844. Map is home; Paper is for rooms off the map (auth, join, leaderboard).

| Screen | Intent | Evidence |
| --- | --- | --- |
| **Waiting** | Map + HUD `0:00` + WAITING. Course is visible, You at checkpoint 1. Sheet holds Start race. | [export](docs/design/exports/player-waiting.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-348) |
| **Live** | Time is the hero. Ember only on LIVE + You + next ring. Sheet is distance, not a second HUD. | [export](docs/design/exports/player-live.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-272) |
| **Finished** | Time + placement on the sheet; FINISHED chip in Mark. All checkpoints Done. | [export](docs/design/exports/player-finished.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-373) |
| **Sign in** | Paper room. Ember tick, Quiet Continue. “The map is waiting.” | [export](docs/design/exports/player-sign-in.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-491) |
| **Join** | Invite code is the race-critical field — Ember Join, Ember focus. | [export](docs/design/exports/player-join.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-513) |
| **Drawer** | Paper 280 from the left, light Ink dim so the map still reads. Active race in a Sand well. Log out is Flare text. | [export](docs/design/exports/player-drawer.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-561) |
| **Leaderboard** | Names only (no avatars). You = Ember name on Sand row. DNF = Flare caption. | [export](docs/design/exports/player-leaderboard.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-529) |

Player visual rules:

- High contrast Ink on Paper; 48pt race verbs.
- Minimal chrome over the map; avoid stacked cards and floating junk.
- Light UI on a bright map. No dark theme in this document; add it later if night racing needs it.
- Bottom sheet and HUD are Paper, not Ember, not glass-dark.

---

## Admin variant

Same Ink / Stone / Paper / Ember family. Admin is a **tool**, not the race.

- Denser type (`Admin/*`) and tables; system fonts; no HUD metaphors.
- Ember for primary actions (Create race, Save), Compact size, not page backgrounds.
- Sand for selected rows and the current nav item; Flare for Delete as text, not a filled button in a table.
- Stay visually quieter than the player app so operators do not feel “in a game.”
- Sidebar 240, Hairline divider, Ember tick + “Admin” overline.

Evidence: [docs/design/exports/admin-races.png](docs/design/exports/admin-races.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-621)

---

## Applying this

When adding or restyling UI: named color roles first, then hex; system type; Ember only when the action or state is race-critical (player) or the primary verb (admin). If a screen looks busy on the map, remove chrome before adding color.

**Implement against Figma, don’t restyle scaffolding in place forever.** Player HUD, sheet, and buttons still use `#0066cc` / `#111` / white bars. The tokens and screens above are the target.

**Foundations board:** [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-81) · [export](docs/design/exports/foundations.png)
