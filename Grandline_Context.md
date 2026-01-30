# 📱 Mobile Frontend — Player App (Map-First UX)

## Core UX Principle

The **map is the home screen**.

At all times, the player should feel like:

> “I am here, the race is happening around me, and my progress is visible.”

The UI should resemble **Google Maps–style navigation**, not a traditional menu-driven app.

---

## Home Screen (Primary Screen)

### Layout

- **Full-screen map** (default view)
- Player’s current location shown as a **custom player marker**
- North-up orientation (no forced bearing rotation in MVP)
- Map pans/zooms with user gestures

### Map Elements

- **Player marker**
  - Uses `assets/markers/user_marker.png`
  - Updates in real time via GPS polling

- **Checkpoints**
  - Rendered as numbered markers
  - Current target checkpoint is visually emphasized
  - Completed checkpoints visually dimmed or marked complete

- **Finish marker**
  - Only visible when last checkpoint is active

### Map Behavior

- On race start:
  - Map auto-centers on player
  - Camera gently re-centers if user drifts far away (soft snap, not aggressive)

- During race:
  - Map does NOT show other players (MVP decision)
  - No trails or replay lines in v0

---

## Top Overlay (Minimal HUD)

Positioned at top of screen, semi-transparent.

Displays:

- **Race name**
- **Elapsed time** (live, large, readable)
- **Checkpoint progress**
  - Example: `Checkpoint 2 / 5`

Optional:

- Small status indicator (`LIVE`, `WAITING`, `FINISHED`)

---

## Bottom Sheet (Contextual Actions)

A **collapsible bottom sheet** that changes based on race state.

### Pre-Race

- Race description
- Allowed mode (Run / Bike icon)
- Start window countdown
- **Primary CTA:** “Start Race”

### In-Race

- Distance to next checkpoint
- Last checkpoint confirmation (“Checkpoint 2 complete”)
- **Secondary CTA:** “Center Map”

### Post-Race

- Finish time
- Placement
- **Primary CTA:** “View Leaderboard”

---

## Navigation Drawer (Hamburger Menu)

Accessible from top-left.

### Drawer Contents

- Profile (name, email)
- Active race (if any)
- Leaderboard shortcut
- Join race (enter invite code)
- Rules / Safety
- Logout

This replaces a traditional tab bar to keep the map uninterrupted.

---

## Leaderboard Screen

Separate screen (not overlayed on map).

Displays:

- Ordered list of participants
- Status per participant:
  - Finished (with time)
  - In progress
  - DNF

- Highlight current user

No avatars in MVP (names only).

---

## Join Race Flow

### Entry Points

- Drawer → “Join Race”
- Deep link (future)

### Join Screen

- Invite code input
- Validation feedback
- Paid race gating:
  - If race is paid and user lacks pass:
    - Show “Requires Beta Pass” message
    - Disable join button

---

## Visual Style (MVP Guidance)

- Clean
- High contrast
- Large touch targets
- Minimal animations
- Avoid visual clutter over the map

---

## Asset References (Mobile Frontend)

The mobile frontend **must reference these assets**, even if placeholders are used:

### Map Markers

- `assets/markers/user_marker.png`
- `assets/markers/checkpoint_marker.png`
- `assets/markers/finish_marker.png`

### Icons

- `assets/icons/run.svg`
- `assets/icons/bike.svg`
- `assets/icons/trophy.svg`
- `assets/icons/invite.svg`

All asset paths should be centralized in:

```
apps/mobile/src/config/assets.ts
```

with safe fallbacks if files are missing.

---

## MVP UX Non-Goals (Explicit)

- No live opponent positions
- No route suggestions
- No turn-by-turn navigation
- No map rotation by heading
- No augmented reality

These are **intentional omissions** to preserve clarity and speed.

---

### Why this matters

This map-first design:

- Immediately communicates value
- Feels intuitive to non-gamers
- Scales naturally into teams, trails, and live opponents later
- Keeps MVP focused while still feeling “real”
