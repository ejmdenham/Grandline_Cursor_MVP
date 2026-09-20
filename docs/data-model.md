# Grandline — Core Data Model

This document describes the Phase 1 races model and the Phase 6 race results model. Implemented in DynamoDB via Terraform in `infra/terraform/`.

---

## Users

**Identity** is handled by **Amazon Cognito**. The mobile app uses Cognito for sign up, sign in, and session (refresh tokens). No REST auth endpoints; the app talks to Cognito directly (Hosted UI or SDK).

**Optional users table:** For Phase 1 we rely on Cognito only. If you need a place to store profile data (display name, email synced from Cognito, etc.) you can add a DynamoDB table keyed by Cognito `sub`:

| Attribute   | Type   | Description                    |
| ----------- | ------ | ------------------------------ |
| `id`        | String | Partition key; Cognito `sub`   |
| `email`     | String | Email (may mirror Cognito)      |
| `name`      | String | Display name                   |
| `created_at`| String | ISO8601 or epoch               |

Phase 1 does **not** create this table; add it in a later phase if needed.

---

## Races

Stored in a DynamoDB table with on-demand billing. Used by the races API (get by invite code, get by id). Leaderboard and participation writes live in a separate `race_results` table.

| Attribute     | Type   | Description |
| ------------- | ------ | ----------- |
| `id`          | String | Partition key; unique race id (e.g. UUID) |
| `name`        | String | Race name |
| `checkpoints` | List   | List of `{ order: number, lat: number, lng: number }` |
| `amot`        | List   | Allowed means of transport, e.g. `["run", "bike"]` |
| `start_window`| String | Start time or window (ISO8601 or epoch) |
| `invite_code` | String | Unique code for join flow; GSI partition key |
| `paid`        | Boolean| Whether the race requires payment / Beta Pass |
| `created_at`  | String | ISO8601 or epoch |
| `organizer_id`| String | Optional; for future organizer linkage |

**GSI:** `by-invite-code` — partition key `invite_code` (string). Enables lookup by invite code for the join flow. Invite codes must be unique per race.

---

## Race results

Stored in a DynamoDB table with on-demand billing. One item per player per race. Used by `GET /races/{id}/leaderboard` and `PUT /races/{id}/participation`.

| Attribute        | Type   | Description |
| ---------------- | ------ | ----------- |
| `race_id`        | String | Partition key; race id |
| `user_id`        | String | Sort key; Cognito `sub` from the player JWT |
| `name`           | String | Display name from JWT (`preferred_username` → `email` → truncated `sub`) |
| `status`         | String | `in_progress` \| `finished` \| `dnf` |
| `finish_time_ms` | Number | Elapsed milliseconds from the player's personal start. Set when `status === finished`. **Client-reported** in Phase 6 (same trust model as Phase 5 local geofence). Not a wall-clock timestamp. |
| `started_at`     | String | ISO8601; set on first `in_progress` write |
| `finished_at`    | String | ISO8601; set on finish |
| `updated_at`     | String | ISO8601; last write |

**Keys:** PK `race_id`, SK `user_id`. Query `race_id = :id` returns every participant for a race.

**GSI:** None in Phase 6. All reads are by `race_id`.

**Placement:** Computed at read (and on finish response), not stored. Finished rows sort by `finish_time_ms` ascending and receive `placement` 1..N. In-progress rows follow (by `started_at`). DNF last. Phase 6 has no player write path for DNF.

**Immutability:** A `finished` row cannot return to `in_progress`. Re-submitting finish keeps the original `finish_time_ms`.
