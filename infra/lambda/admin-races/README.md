# Admin Races Lambda

Admin API for race CRUD. Requires JWT with `cognito:groups` containing `admin`.

- **GET /admin/races** — list all races (Scan)
- **GET /admin/races/{id}** — get race by id
- **POST /admin/races** — create race (UUID, created_at)
- **PUT /admin/races/{id}** — update race
- **DELETE /admin/races/{id}** — delete race

Env: `RACES_TABLE_NAME`. See [docs/data-model.md](../../../docs/data-model.md) for race schema.
