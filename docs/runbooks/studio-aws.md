# Studio AWS — workshop and doorbell

Conductor Cloud Computer agents use **one identity for this AWS account**. A project is in play when its Terraform state key lives in the shared bucket `tfstate-<account_id>`.

## How it fits together

```
Studio VM  --assume-role-->  conductor-studio (AdministratorAccess, this account)
     |                              |
     | terraform init/plan/apply    |  reads/writes
     v                              v
  repo code + backend key     s3://tfstate-<account>/…/terraform.tfstate

Studio VM  --gh workflow run-->  GitHub Actions (Grandline only)
                                      |
                                      | OIDC
                                      v
                               grandline-gha-deploy (this repo, main apply)
```

- **Map** — S3 `tfstate-<account_id>` + DynamoDB `terraform-locks`. One key per stack. Other projects join by adding a key, not a new IAM user.
- **Workshop (Lane A)** — IAM user `conductor-studio` assumes role `conductor-studio`. Keys live only in Conductor Cloud Computer environment.
- **Doorbell (Lane B)** — GitHub Actions OIDC assumes `grandline-gha-deploy` for **this repo only**. Apply stays on `main`.

Blast radius is **this AWS account**. Any workspace on the Cloud Computer can terraform any stack whose state it can load. Do not put these keys in a production account if you need a fence.

Grandline keys:

- `grandline/player/terraform.tfstate`
- `grandline/admin/terraform.tfstate`

---

## Pilot apply (MP_0)

Copilot does **not** run these. Use the laptop that already has AWS admin credentials.

```bash
cd infra/bootstrap
cp terraform.tfvars.example terraform.tfvars
# Set github_org and github_repo to this remote:
#   gh repo view --json nameWithOwner -q .nameWithOwner
terraform init
terraform plan
terraform apply
terraform output
```

If apply fails because the GitHub OIDC provider already exists, set `create_github_oidc_provider = false` in `terraform.tfvars` and apply again.

The OIDC provider is `prevent_destroy`. `terraform destroy` in `infra/bootstrap` **errors** instead of deleting it. To destroy studio IAM / bucket / GHA role and leave OIDC in the account: `./scripts/bootstrap-destroy-keep-oidc.sh`. Do not delete the provider in the console.

Create the studio access key **once**. Do not paste the secret into chat or git.

```bash
aws iam create-access-key --user-name conductor-studio
```

**Proof to paste (no secrets):** `state_bucket`, `lock_table`, `gha_deploy_role_arn`, `studio_role_arn`, `account_id`, and `studio access key created`.

---

## Pilot migrate Grandline state (MP_1)

Do this **once**, from the machine that currently has local `terraform.tfstate` files, **after** bootstrap apply.

```bash
cd infra/terraform
terraform init -migrate-state \
  -backend-config="bucket=tfstate-$(aws sts get-caller-identity --query Account --output text)" \
  -backend-config="region=eu-north-1" \
  -backend-config="dynamodb_table=terraform-locks" \
  -backend-config="encrypt=true"
# answer yes to copy state to S3

cd ../terraform_admin
terraform init -migrate-state \
  -backend-config="bucket=tfstate-$(aws sts get-caller-identity --query Account --output text)" \
  -backend-config="region=eu-north-1" \
  -backend-config="dynamodb_table=terraform-locks" \
  -backend-config="encrypt=true"

cd ../..
./scripts/infra.sh plan
```

Happy path: `Successfully configured the backend "s3"` and plans with **No changes**.

If you have **no** local state, say so — do not apply into an empty remote state without confirming you intend to recreate the stack.

**Proof:** last lines of both inits and both plan summaries.

---

## Doorbell (MP_2)

GitHub repo variable `AWS_ROLE_ARN` = bootstrap output `gha_deploy_role_arn`. Create GitHub Environment **dev**.

```bash
gh variable set AWS_ROLE_ARN --body "<gha_deploy_role_arn>"
# After this workflow exists on the default branch (or --ref a pushed branch):
gh workflow run infra-deploy.yml -f stack=both -f apply=false
gh run watch
```

Apply from Actions only when `ref` is `main` and `apply=true`. Feature-branch apply via OIDC is denied by design.

Studio evidence for “deployed” = the workflow run URL.

Without Lane A, a VM still cannot `terraform plan` locally, tail logs, or run `./scripts/gen-env.sh`.

**Proof:** Actions run URL; from one Conductor terminal, whether `gh workflow list` / `gh workflow run` works.

---

## Conductor Cloud Computer (MP_3)

**Settings → Organization → Cloud Computer → Environment**

| Name | Value |
| --- | --- |
| `AWS_REGION` | `eu-north-1` |
| `AWS_ROLE_ARN` | bootstrap `studio_role_arn` |
| `AWS_ACCESS_KEY_ID` | from `create-access-key` |
| `AWS_SECRET_ACCESS_KEY` | from `create-access-key` |

**Install software script** (once per computer build):

```bash
bash scripts/conductor-cloud-install.sh
```

If the script path is not in the clone during the org install, paste the contents of [scripts/conductor-cloud-install.sh](../../scripts/conductor-cloud-install.sh).

**Repository setup script** (every new Grandline workspace):

```bash
bash scripts/conductor-workspace-setup.sh
```

Then **Build computer**. New workspace, in the cloud terminal:

```bash
aws sts get-caller-identity
cd infra/terraform && terraform plan
./scripts/gen-env.sh
gh workflow list
```

**Proof:** caller ARN contains `conductor-studio`; `terraform plan` uses remote state; yes/no on `gh workflow run`. Do not paste keys.

---

## Studio standing orders

- Iterate in the VM (Lane A). Ship/prove on `main` via the workflow URL (Lane B).
- Never print AWS keys, session tokens, or `terraform.tfvars` secrets into chat or logs.
- Never apply the same stack from two workspaces at once (shared state lock will fight; two applies still serialize badly).
- Joining another project in this account: put its state key in `tfstate-<account_id>` (for example `otherapp/dev/terraform.tfstate`). Same Conductor secrets. Give that repo its own OIDC role if it needs a doorbell.
