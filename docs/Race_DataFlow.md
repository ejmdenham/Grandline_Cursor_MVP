# GrandLine — Complete MVP Architecture & Data Flow (All‑in‑One)

This document is designed to be given **directly to Cursor** or any AI coding assistant **with zero prior knowledge**. It fully defines the GrandLine MVP race system from concept → frontend → backend → data → rules.

---

## SECTION 1 — What the App Is

GrandLine is a **real‑world, GPS‑based racing and adventure app**.

Users physically move through real locations while the app:

* Displays race locations on a map
* Tracks GPS movement
* Verifies arrival at required locations
* Progressively reveals race objectives
* Records finish times and rankings

A race is not virtual — **users must physically travel to locations**.

---

## SECTION 2 — Core Concepts (Explicit Definitions)

### Geofence

A **geofence** is a virtual area on the map defined by:

* Latitude
* Longitude
* Radius (meters)

When a user’s GPS position enters this area, the app can trigger logic.

Geofences are used to:

* Verify physical presence
* Prevent cheating
* Trigger race progress

---

### Race

A **race** consists of:

1. One start geofence
2. One or more checkpoint geofences
3. One final checkpoint (finish)

A race is completed by entering each required geofence in the correct order.

---

### Checkpoint Reveal Modes

#### All‑At‑Once Mode

* All checkpoints are visible at race start
* User can plan any route

#### Progressive Reveal Mode

* Only one checkpoint is visible at a time
* Entering a checkpoint reveals the next
* Next checkpoint is unknown until previous is completed

This mode is defined per race.

---

## SECTION 3 — User Flow (Frontend Experience)

### Screen 1 — Map / Discover

* App requests user location
* Backend returns nearby races
* Start zones shown on map as circles

---

### Screen 2 — Race Detail

* User taps race
* App shows:

  * Rules (walk, bike, etc.)
  * Entry fee
  * Start time
  * Checkpoint reveal mode

---

### Screen 3 — Join Race

* User confirms join
* Backend creates participation record
* User status = JOINED

---

### Screen 4 — Active Race

* User taps Start
* GPS tracking begins
* App shows active checkpoint(s)

---

### Screen 5 — Checkpoint Completion

* App detects geofence entry
* App sends GPS data to backend
* Backend verifies and confirms
* Next checkpoint revealed if progressive

---

### Screen 6 — Finish

* Final checkpoint entered
* Finish time recorded
* Rank calculated
* Results shown

---

## SECTION 4 — Frontend Responsibilities (React Native)

Frontend:

* Displays map and geofences
* Tracks GPS
* Detects geofence entry locally
* Sends events to backend
* Manages UI state

Frontend **never decides winners or race validity**.

---

## SECTION 5 — Backend Responsibilities (AWS)

Backend:

* Stores race definitions
* Controls checkpoint visibility
* Verifies checkpoint completion
* Records times
* Computes rankings
* Applies anti‑cheat rules

Backend is **authoritative**.

---

## SECTION 6 — API CONTRACT (REST)

### GET /races

Returns nearby races

Response:

```json
[{ "raceId": "r1", "startZone": {"lat": 0, "lng": 0, "radius": 200}, "startTime": "ISO" }]
```

---

### GET /races/{raceId}

Returns race details

Response:

```json
{ "raceId": "r1", "checkpointRevealMode": "progressive", "rules": "walk" }
```

---

### POST /races/{raceId}/join

Creates participation

Response:

```json
{ "status": "joined" }
```

---

### POST /races/{raceId}/start

Marks race active for user

Response:

```json
{ "startTime": "ISO", "currentCheckpoint": {"index": 0, "lat": 0, "lng": 0, "radius": 50} }
```

---

### POST /races/{raceId}/checkpoint

Verifies checkpoint

Request:

```json
{ "checkpointIndex": 0, "lat": 0, "lng": 0, "timestamp": "ISO" }
```

Response:

```json
{ "verified": true, "nextCheckpoint": {"index": 1, "lat": 0, "lng": 0, "radius": 50} }
```

---

### POST /races/{raceId}/finish

Finalizes race

Response:

```json
{ "finishTime": "ISO", "rank": 5 }
```

---

## SECTION 7 — DynamoDB Data Model

### Table: Races

PK: raceId
Attributes: startZone, rules, revealMode

---

### Table: Checkpoints

PK: raceId
SK: checkpointIndex
Attributes: geofence

---

### Table: Participants

PK: raceId
SK: userId
Attributes: status, currentCheckpointIndex, startTime, finishTime

---

## SECTION 8 — Anti‑Cheat Rules (Plain Language)

1. Checkpoint must be entered in correct order
2. GPS must be inside geofence radius
3. Speed between checkpoints must be plausible
4. Device must linger inside geofence briefly

Violations result in rejection or disqualification.

---

## SECTION 9 — MVP Scope (Locked)

MVP includes:

* Progressive checkpoint races
* GPS verification
* Basic leaderboard

MVP excludes:

* Guilds
* Adventures
* Subscriptions

---

## SECTION 10 — Cursor System Prompt (Copy‑Paste)

You are building a React Native app using AWS backend services. Implement a GPS‑based racing system where users physically travel to geofenced checkpoints. The backend is authoritative. Frontend detects geofence entry and requests verification. Use REST APIs as defined. Implement progressive checkpoint reveal.

---

END OF DOCUMENT
