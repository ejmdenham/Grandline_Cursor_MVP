# Races Lambda

Handles `GET /races?inviteCode=...` and `GET /races/{id}`. Requires Cognito JWT.

**Before first `terraform apply`:** From this directory run:

```bash
npm install
```

So `node_modules` is included when Terraform zips the folder for deployment.
