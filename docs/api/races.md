# Races API

Base path: `/races`. All routes require a valid Cognito JWT in the `Authorization` header: `Bearer <token>`.

Player join-by-invite and get-by-id are unchanged from Phase 1. Phase 6 adds leaderboard read and participation write.

---

## GET /races?inviteCode={code}

Get a race by its invite code (used in the join flow).

**Query**

| Name        | Type   | Required | Description |
| ----------- | ------ | -------- | ----------- |
| `inviteCode`| string | Yes      | Unique invite code for the race |

**Responses**

- **200** — Race found. Body: race object (see shape below).
- **404** — No race with that invite code.
- **401** — Missing or invalid token.

---

## GET /races/{id}

Get a race by its id.

**Path**

| Name | Type   | Description   |
| ---- | ------ | ------------- |
| `id` | string | Race id (PK)  |

**Responses**

- **200** — Race found. Body: race object (see shape below).
- **404** — No race with that id.
- **401** — Missing or invalid token.

---

## Race response shape

Same for both endpoints.

| Field         | Type    | Description |
| ------------- | ------- | ----------- |
| `id`          | string  | Race id     |
| `name`        | string  | Race name   |
| `checkpoints` | array   | `[{ order, lat, lng }, ...]` |
| `amot`        | array   | e.g. `["run", "bike"]` |
| `start_window`| string  | ISO8601 or epoch |
| `invite_code` | string  | Invite code |
| `paid`        | boolean | Whether the race is paid |
| `created_at`  | string  | ISO8601 or epoch |
| `organizer_id`| string  | Optional; may be omitted |

---

## GET /races/{id}/leaderboard

Ordered results for a race. Placement is computed at read time.

**Path**

| Name | Type   | Description  |
| ---- | ------ | ------------ |
| `id` | string | Race id (PK) |

**Responses**

- **200** — Race exists. Body: `{ race_id, race_name, entries }`. `entries` may be `[]` if nobody has started.
- **404** — No race with that id.
- **401** — Missing or invalid token.

**Entry shape** (snake_case; mobile client also accepts camelCase)

| Field            | Type    | Description |
| ---------------- | ------- | ----------- |
| `user_id`        | string  | Cognito `sub` |
| `name`           | string  | Display name |
| `status`         | string  | `finished` \| `in_progress` \| `dnf` |
| `finish_time_ms` | number  | Elapsed ms; only when `finished` |
| `placement`      | number  | 1-based; only when `finished` |

Order: finished (ascending `finish_time_ms`), then in progress, then DNF.

---

## PUT /races/{id}/participation

Idempotent upsert of the caller's participation. `user_id` is always taken from JWT `sub`, never from the body.

**Path**

| Name | Type   | Description  |
| ---- | ------ | ------------ |
| `id` | string | Race id (PK) |

**Request body**

| Field            | Required when            | Description |
| ---------------- | ------------------------ | ----------- |
| `status`         | Always                   | `in_progress` or `finished` |
| `finish_time_ms` | `status === "finished"`  | Elapsed ms since personal start; integer `> 0` and `< 86400000` |

Start (from the player Start Race CTA):

```json
{ "status": "in_progress" }
```

Finish (from the map when the last checkpoint is hit):

```json
{ "status": "finished", "finish_time_ms": 324000 }
```

**Responses**

- **200** — Upserted. Body: `{ race_id, user_id, status, finish_time_ms?, placement? }`. `placement` is present when `status` is `finished`.
- **400** — Invalid body (bad status, missing/invalid `finish_time_ms`).
- **401** — Missing or invalid token / missing `sub`.
- **404** — No race with that id.
- **409** — Caller is already `finished` and asked to return to `in_progress`.

Re-finish is idempotent: the original `finish_time_ms` is kept. Join alone does not create a row; `in_progress` is written when the player starts.
