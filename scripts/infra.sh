#!/usr/bin/env bash
# Apply or destroy both Terraform stacks in order (player then admin for apply; admin then player for destroy).
# Run from repo root: ./scripts/infra.sh apply [terraform args...]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

usage() {
  echo "Usage: $0 apply [terraform args...]  # player then admin" >&2
  echo "       $0 destroy [terraform args...] # admin then player" >&2
  echo "       $0 plan [terraform args...]   # player then admin" >&2
  echo "       $0 init [terraform args...]   # init both with S3 backend config" >&2
  exit 1
}

tf_init() {
  local account_id region
  account_id="$(aws sts get-caller-identity --query Account --output text)"
  region="${AWS_REGION:-eu-north-1}"
  terraform init \
    -backend-config="bucket=tfstate-${account_id}" \
    -backend-config="region=${region}" \
    -backend-config="dynamodb_table=terraform-locks" \
    -backend-config="encrypt=true" \
    "$@"
}

CMD="${1:-}"
shift || true
[[ -n "$CMD" ]] || usage

case "$CMD" in
  init)
    cd "$REPO_ROOT/infra/terraform"
    tf_init "$@"
    cd "$REPO_ROOT/infra/terraform_admin"
    tf_init "$@"
    ;;
  apply)
    cd "$REPO_ROOT/infra/terraform"
    tf_init
    terraform apply "$@"
    cd "$REPO_ROOT/infra/terraform_admin"
    tf_init
    terraform apply "$@"
    ;;
  destroy)
    cd "$REPO_ROOT/infra/terraform_admin"
    tf_init
    terraform destroy "$@"
    cd "$REPO_ROOT/infra/terraform"
    tf_init
    terraform destroy "$@"
    ;;
  plan)
    cd "$REPO_ROOT/infra/terraform"
    tf_init
    terraform plan "$@"
    cd "$REPO_ROOT/infra/terraform_admin"
    tf_init
    terraform plan "$@"
    ;;
  *)
    usage
    ;;
esac
