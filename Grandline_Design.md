# Grandline — Design Language

High-level visual and verbal flavor for Grandline, plus the v1 UI system designed from it. This is the source of truth for **how the product should feel**. Product behavior lives in [Grandline_Context.md](Grandline_Context.md); vision lives in [Grandline_Concept.md](Grandline_Concept.md).

**Scope:** Shared brand for the player app, with a short admin variant. The player app *is* the brand; admin uses the same materials, denser and quieter — a tool, not a second identity.

**Canvas:** [Grandline UI (Figma)](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI) — **Product** page is canonical; **Motion** is the timing spec; **Player** is the v1 skeleton kept for comparison. Snapshots: [docs/design](docs/design/README.md). If a mock and this document disagree on *feel*, this document wins. If they disagree on *layout of a shipped screen*, Figma wins until this file is updated.

---

## Personality

Grandline is an **always-alive race instrument** — a sports chronograph / rally computer. Race-day energy is the floor, not a start-line spike. Waiting, live, auth, and admin share the same charged materials. Start, checkpoint, and finish still punch harder.

It should feel like a well-made sports watch you can actually race with: full, precise, tactile. Not a game, not a social feed, not a sci-fi cockpit, and not an empty paper shell.

| It is | It is not |
| --- | --- |
| Athletic, timed, outdoor | Gamified, neon, sticker-covered |
| Instrument-dense on the map | Decorative, skeuomorphic, cinematic HUD |
| Warm and physical (dust, sun, metal, pulse) | Cold corporate blue, or candy fitness |
| Full presence, crisp feedback | Quiet/empty/spare, chatty, or nautical-costume |

**One-liner:** *A race instrument that's always alive.*

**Density split:** The map/race is the instrument (course, markers, HUD, sheet telemetry). Auth, lists, drawer, leaderboard, and admin stay cleaner — fullness from contrast, type, surfaces, Dusk metal, and Ember/Mark *structure*, not fake gauges.

---

## Color

**Story:** Warm race-day. Charcoal structure, sun-baked surfaces, bronze-metal chrome, Ember and Mark as *structure* as well as signal. Light-first so HUD and sheets stay readable on a bright map in outdoor sun.

Named roles (use these names in code and conversation). Hexes are the v1 values in Figma variables.

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary | **Ink** | `#1C1917` | Text, icons, Quiet primary controls (auth, settings, admin structure) |
| Secondary | **Stone** | `#78716C` | Secondary text, inactive copy — not boxes |
| Metal | **Dusk** | `#4A433C` | Chrome metal: HUD/sheet rims, tick rest, selected borders, input rest, table rules, drawer dividers |
| Surface | **Paper** | `#FAFAF9` | Sheets and HUD fill — not the empty page |
| Surface muted | **Sand** | `#F5F0EB` | Wells, selected rows, chips, roads, off-map page wash |
| Sky wash | **Haze** | `#F0E4D4` | Warm sky / top-of-map / admin canvas — light variance, not a second accent |
| Land dark | **Clay** | `#CDB9A2` | Hills, shade, darker terrain patches |
| Tertiary / accent | **Ember** | `#E85D04` | Race-critical CTAs **and** structure: focus, current tick, remaining path, selected bar, LIVE |
| On-accent | **Ember ink** | `#FFF7ED` | Text/icons on Ember |
| Success | **Mark** | `#15803D` | Checkpoint complete, finished, positive confirm **and** completed ticks/path |
| Danger | **Flare** | `#C2410C` | Errors, DNF, destructive — warm, not candy red |
| Rule | **Hairline** | `#E7E5E4` | Quiet 1px only when Dusk would be too heavy (inner wells) |
| Map land | **Map land** | `#E8DFD4` | Terrain under chrome (Figma stand-in; live map is real tiles) |
| Map water | **Map water** | `#C9D4D0` | Water on the stand-in map — natural, not a second brand accent |
| Map park | **Map park** | `#D5DCC8` | Vegetation on the stand-in map |

**HUD on map:** Paper at ~82% (`--opacity-hud`), Dusk 1.5px rim, Ink type. Ember and Mark appear as ticks, LIVE, You, and the remaining course — not as a flood fill.

**Do**

- Ember/Mark are structure, not only CTAs: ticks, path, focus rings, selected bars, completed gates.
- Dusk is the metal. Use it for rims and rules so Paper never reads as empty white.
- Let the map carry most of the field color. Terrain is not one flat beige: Haze sky, Clay hills, park, water, a warm sun wash. Light variance, not a second loud accent.
- Let chrome carry metal + Ember/Mark. Off-map pages sit on Sand/Haze, not a blank Paper field.
- Dim completed checkpoints toward Mark; emphasize the current target with an Ember ring; upcoming gates sit on Dusk.

**Don’t**

- Default to generic `#0066cc` / pure black / `#c00` — those were scaffolding. The current apps still use them; restyle to these roles.
- Use Ember as a large fill background (cover, sheets, drawers, admin chrome).
- Introduce a second *loud* brand accent (teal, electric blue, lime). Dusk is metal, not a second accent.
- Use a blue focus ring. Focus is Ember. Error is Flare.
- Leave large Paper fields with no rim, tick, or rule — that is the old empty shell.

**Semantic tokens (Figma Color collection, Light only):** `text/primary`, `text/secondary`, `text/on-accent`, `text/accent`, `text/success`, `text/danger`, `bg/page`, `bg/muted`, `bg/accent`, `bg/inverse`, `border/default`, `border/strong` (Dusk), `border/accent` (Ember), `icon/*`, `map/*`. No dark theme in v1.

---

## Type and icons

- **UI type:** System fonts only (`system-ui` / San Francisco / Roboto). No custom display face.
- **Figma stand-in:** Inter (Regular / Semi Bold / Bold). Implement with the platform UI font, not Inter, unless Inter is already shipping.
- **Hierarchy:** Elapsed time is the loudest number; race name is secondary; captions stay Stone. Off-map screens still use a clear title + metal rule so they do not feel sparse.
- **Weights:** Regular for body, semibold for actions, bold for live time and placement.
- **Icons:** Simple geometric strokes. Run / bike / trophy / invite should read at small sizes on the map and in the sheet. No mascots, no illustrated stickers. Menu is three strokes, 18px.

### Type ramp

| Style | Size / line | Weight | Use |
| --- | --- | --- | --- |
| **Time** | 40 / 44, tracking −1.2 | Bold | Chronograph — elapsed clock and distance |
| **Placement** | 36 / 40, tracking −0.8 | Bold | Finish rank only (`2nd`) |
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

4pt grid. On the map, fill the instrument. Off the map, fullness comes from materials and structure, not extra widgets.

| Token | Value | Use |
| --- | --- | --- |
| `space/4` … `space/48` | 4, 8, 12, 16, 24, 32, 48 | Gaps and padding |
| `radius/sm` | 8 | Mode chips, admin selected nav |
| `radius/md` | 10 | Buttons, inputs, leaderboard rows |
| `radius/lg` | 16 | Bottom sheet top corners; HUD 12 |
| `radius/pill` | 999 | Status chips only |
| `size/touch` | 40 | Action buttons — dense, not a slab |
| Compact control | 32 | Admin primary, dense tools |
| HUD inset | 16 | From screen left/right, below status bar |
| Sheet side pad | 20 | Sheet content |

Lift is glass with metal, not a card stack. HUD: Paper at 82% + background blur 22 + Dusk 1.5px rim + a 12% Ink shadow (y 8 / blur 24). Sheet: Paper at 96% + Dusk top rim + upward shadow. Never a hard drop, never a second floating circle, never sci-fi stacked glass.

---

## Motion

Motion is **feedback**, not flavor, and it is product-wide: auth, join, lists, admin, and map. Rest can sit still. Interaction always answers.

**Grandline ease:** `cubic-bezier(0.2, 0.9, 0.2, 1)` — arrives fast, settles, no bounce. Prefer 80–280ms. Spec board: [Motion / Beats](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=9-379) · [export](docs/design/exports/motion-beats.png)

| Beat | Timing | What happens |
| --- | --- | --- |
| **Press** | 80ms in · 160ms out | Scale 0.97 on buttons, FAB, menu, rows, nav items. Light haptic on Action. |
| **Focus** | 120ms | Ember 1.5px ring on inputs and selected rows. Not blue. |
| **Success** | 180ms | Mark flash on confirm (checkpoint well, saved row). Toast if the map needs it. |
| **Error** | 160ms | Flare ring. No shake. |
| **Start race** | 280ms | WAITING dissolves. LIVE fades in. Clock arms to `0:00`. Sheet compresses ~24px. HUD locks. No bounce. |
| **Checkpoint** | 180 / 900 / 220 | Toast rises 12px. Marker Next → Done. You pulse once. Toast exits. Mark well stays in the sheet. |
| **LIVE pulse** | 1600ms loop | **The only loop, and only on the map instrument.** 6px Ember dot 1.0 → 0.45 → 1.0. You-ring scale 1.0 → 1.4, opacity 0.16 → 0. Keyframed on Product / Live. Auth/admin/lists do not loop. |
| **Sheet** | 280ms spring | Handle 36×4 Dusk. Expand/collapse, stiffness 380 / damping 32. Content fades 120ms, delayed 40ms. |
| **Finish** | 420ms | The linger. Time holds. `2nd` fades 80ms later. Ember CTA last. Map stills. No confetti. |

Every control still answers the finger: opacity 1.0 → 0.88 on press, Ember focus ring 1.5px, Flare color is enough for error.

No parallax, no looping attention-grabbers besides the LIVE you-dot, no confetti, no ambient looping UI off the map. If motion does not mark a press, focus, success, error, or race-state change, skip it.

---

## Voice

**Default: precise instrument.** Clear, present tense, a little charge. Still short. Google Maps energy with a chronograph in the room: *Start race. 1.2 km to next. Center map.*

**Race-day coach** at punctuation (start, last checkpoint, finish, placement). Direct, timed, a little fire — still short. Never cheerleading paragraphs.

| Do | Don’t |
| --- | --- |
| Start race | Let’s do this!! |
| Checkpoint 3 of 5 | You’re crushing it |
| Finished · 1:12:04 · 2nd | Wow what a legend |
| The map is waiting. | Welcome to Grandline!! |
| 1.2 km to next | You’re 1.2 km from glory |
| Center map | Recenter on me |
| Opens in 14m | Get ready to crush it |
| Paid races require a beta pass. | Unlock the premium adventure |

**Brand mark in UI:** a 28×4 Ember tick on a Dusk rule, then overline `GRANDLINE` in Stone. Never a logo lockup, wave, or compass rose.

---

## Chrome (player)

The current code uses a full-width white HUD bar and a shadowed sheet. Canonical design is glass + Dusk metal, with Ember/Mark as ticks and path.

### HUD

Glass chronograph with a metal rim. 358 wide, 16px inset. Menu well · time cluster · status.

| Slot | Content |
| --- | --- |
| Menu | 36 circular Sand well, Dusk rim, three strokes |
| Race | Overline `ARCHIPELAGO LOOP` |
| Time | 40px chronograph |
| Course ticks | Five 8px dots under the clock — Mark / Ember now / Dusk upcoming |
| Status | Sand wash + 6px dot. `WAITING` Stone, `LIVE` Ember, `DONE` Mark. Never a fat orange lozenge. |

Recenter is a 48 FAB on the map (crosshair, Dusk rim), not a full-width Ghost button in the sheet.

### Bottom sheet

Paper 96%, 16px top radius, Dusk rim, lift shadow, 20px side pad. Live sheet is a **triad instrument**: distance (Time) · split · named gate. Ticks are 8px Mark/Ember/Dusk, not Hairline dust.

| State | Sheet says | Primary |
| --- | --- | --- |
| Waiting | Title, compact meta row `5 gates · 12.4 km · run`, `Opens in 14m`, ticks, 40pt Ember **Start race**. No empty well above the CTA.
| Live | `1.2 km` · `4:12` split · Ridge gate · ticks · Mark well | FAB recenter |
| Checkpoint | Same as Live, plus centered toast | — |
| Finished | `Finished` · `1:12:04` · **2nd** | Ember **View leaderboard** |

### Map and markers

The map *is* the instrument. Course is drawn thick: Mark/Dusk spline for completed, Ember dashed for remaining. Distance callout on the remaining path. Scale bar. **You** is a 40px instrument — Ember core, Paper ring, outer pulse (the LIVE loop). Next / Open / Done sit on the path.

| Kind | Look |
| --- | --- |
| **You** | 12px Ember core, 20px Paper ring, 40px pulse |
| **Next** | 32px Paper, Ember ring, Ink number |
| **Open** | 28px Paper, Dusk ring, Stone number |
| **Done** | 28px Paper, Mark check |
| **Finish** | Geometric Ember flag — last checkpoint only |

### Sign in

The map is already home. Auth is a Paper sheet over terrain, Ember tick on a Dusk rule, Quiet **Continue**. Inputs: Sand well, Dusk rest ring, Ember focus. Not a blank form room, not a cockpit.

### Drawer / Join / Leaderboard

Cleaner than the map, not sparse. Dusk dividers, Ember 3px selected bar, Sand wells, chronograph times. No fake telemetry.

---

## Components

Buttons, chips, inputs, markers, HUD: [Components page](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-55).

**Button kinds**

| Kind | Fill | When |
| --- | --- | --- |
| Ember | Ember / Ember ink | Race-critical: Start race, Join, View leaderboard, Create race |
| Quiet | Ink / Ember ink | Auth Continue, structural primary off the map |
| Ghost | Paper + Dusk / Ink | Secondary on the map (Center map) |
| Flare | Flare / Ember ink | Destroy only if it is the screen’s verb; prefer Flare *text* for row Delete / Log out |

Sizes: **Action** 40pt (player), **Compact** 32pt (admin). Full-width is allowed; height is not a 100px slab. Press: 80/160ms scale 0.97.

**Chip:** LIVE / WAITING / FINISHED are status. Run / Bike are Sand + Ink + Dusk rim — not Ember fills.

**Input:** Sand well, Dusk rest, Ember ring on focus, Flare ring + Flare helper on error. Never a blue caret ring.

---

## Screens

Phone frame 390×844. Canonical frames are on the Figma **Product** page.

| Screen | Intent | Evidence |
| --- | --- | --- |
| **Waiting** | Chronograph at `0:00`. Course visible, You at gate 1. Sheet holds Start race + meta + ticks. | [export](docs/design/exports/player-waiting.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-125) |
| **Live** | Time is the instrument. Ember/Mark/Dusk on ticks, You, path. Sheet triad: km / split / gate. | [export](docs/design/exports/player-live.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-42) |
| **Checkpoint** | Toast over the map: `Checkpoint 3` / `Marked. Keep moving.` Then settle. | [export](docs/design/exports/player-checkpoint.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-283) |
| **Finished** | Time + `2nd` on the sheet; `DONE` in Mark. Path complete. | [export](docs/design/exports/player-finished.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-204) |
| **Sign in** | Terrain behind, auth sheet in front. Ember tick + Dusk rule. “The map is waiting.” | [export](docs/design/exports/player-sign-in.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-514) |
| **Join** | Invite field as instrument input. Ember Join. | [export](docs/design/exports/player-join.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-545) |
| **Drawer** | Identity + active-race well with Ember bar. Dusk nav rules. | [export](docs/design/exports/player-drawer.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-568) |
| **Leaderboard** | Rank column in Dusk, You row Ember bar + Sand. Chronograph times. | [export](docs/design/exports/player-leaderboard.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=12-642) |
| **Admin** | Same family, denser tables, Ember structure on selected nav. | [export](docs/design/exports/admin-races.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=21-175) |

Player visual rules:

- High contrast Ink on Paper; 40pt race verbs.
- Map chrome is an instrument — ticks, rims, path — not stacked cards or floating junk.
- Light UI on a bright map. No dark theme in this document; add it later if night racing needs it.
- Bottom sheet and HUD are Paper + Dusk, not Ember fills, not glass-dark.

---

## Admin variant

Same Ink / Stone / Paper / Ember / Dusk family. Admin is a **tool**, not the race.

- Denser type (`Admin/*`) and tables; system fonts; no HUD metaphors, no fake gauges.
- Ember for primary actions (Create race, Save) and for the selected-nav bar — Compact size, not page backgrounds.
- Sand for selected rows; Dusk for table rules and sidebar edge; Flare for Delete as text, not a filled button in a table.
- Stay visually quieter than the player map so operators do not feel “in a game” — quieter, not empty.
- Sidebar 240, Dusk divider, Ember tick + “Admin” overline.
- **Races table fills the main column.** Columns spread (name · invite · window · course · status · actions). Sand/Haze canvas, not a thin table on empty Paper. Row padding 10/12. Toolbar hugs the table.

Evidence: [docs/design/exports/admin-races.png](docs/design/exports/admin-races.png) · [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=21-175)

---

## Applying this

When adding or restyling UI: named color roles first, then hex; system type; Ember/Mark as structure plus race-critical verbs; Dusk as metal. If a screen looks empty, add rim, ticks, and Ember/Mark structure before adding widgets. If it looks like a cockpit, remove layers before adding color.

**Implement against Figma, don’t restyle scaffolding in place forever.** Player HUD, sheet, and buttons still use `#0066cc` / `#111` / white bars. The tokens and screens above are the target.

**Foundations board:** [Figma](https://www.figma.com/design/EOw4mEooOdLYbd6FGQbPs8/Grandline-UI?node-id=1-81) · [export](docs/design/exports/foundations.png)
