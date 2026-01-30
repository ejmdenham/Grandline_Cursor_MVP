# Grandline — Core Data Model

This document describes the Phase 1 data model for users and races. Implemented in DynamoDB via Terraform in `infra/terraform/`.

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

Stored in a DynamoDB table with on-demand billing. Used by the races API (get by invite code, get by id).

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
