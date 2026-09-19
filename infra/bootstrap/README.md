# Account bootstrap

Terraform that creates the **shared** AWS workshop for Conductor Studio (state bucket, locks, OIDC, `conductor-studio`, Grandline GHA role).

State for *this* stack stays **local** on the laptop that applies it. Do not migrate bootstrap state into the bucket it creates.

Apply is a Pilot step. Follow [docs/runbooks/studio-aws.md](../../docs/runbooks/studio-aws.md).

The GitHub OIDC provider has `lifecycle.prevent_destroy`. A plain `terraform destroy` in this directory **fails** so the provider is not deleted. To tear down studio IAM / state bucket / GHA role and **keep** OIDC:

```bash
./scripts/bootstrap-destroy-keep-oidc.sh
```

Then set `create_github_oidc_provider = false` before any later apply.
