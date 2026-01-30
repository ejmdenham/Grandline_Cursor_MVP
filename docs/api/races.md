# Races API

Base path: `/races`. All routes require a valid Cognito JWT in the `Authorization` header: `Bearer <token>`.

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
