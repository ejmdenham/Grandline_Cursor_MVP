# Account bootstrap

Terraform that creates the **shared** AWS workshop for Conductor Studio (state bucket, locks, OIDC, `conductor-studio`, Grandline GHA role).

State for *this* stack stays **local** on the laptop that applies it. Do not migrate bootstrap state into the bucket it creates.

Apply is a Pilot step. Follow [docs/runbooks/studio-aws.md](../../docs/runbooks/studio-aws.md).

The GitHub OIDC provider and `conductor-studio` user/role have `lifecycle.prevent_destroy`. A plain `terraform destroy` in this directory **fails** so Conductor env vars and OIDC stay valid.

`./scripts/infra.sh destroy` only tears down player + admin. It does not touch bootstrap or Conductor keys.

To tear down the state bucket / GHA role and **keep** OIDC + Conductor identity:

```bash
./scripts/bootstrap-destroy-keep-oidc.sh
```

Then set `create_github_oidc_provider = false` before any later apply. Access keys are created with `aws iam create-access-key` and are not Terraform resources.
