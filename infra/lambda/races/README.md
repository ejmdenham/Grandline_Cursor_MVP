# Races Lambda

Handles player JWT routes:

- `GET /races?inviteCode=...`
- `GET /races/{id}`
- `GET /races/{id}/leaderboard`
- `PUT /races/{id}/participation`

**Before first `terraform apply`:** From this directory run:

```bash
npm install
```

So `node_modules` is included when Terraform zips the folder for deployment.

```bash
npm test
```
