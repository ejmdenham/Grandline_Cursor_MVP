#!/usr/bin/env bash
# Apply or destroy both Terraform stacks in order (player then admin for apply; admin then player for destroy).
# Run from repo root: ./scripts/infra.sh apply [terraform args...] or ./scripts/infra.sh destroy [terraform args...]
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

usage() {
  echo "Usage: $0 apply [terraform args...]  # player then admin" >&2
  echo "       $0 destroy [terraform args...] # admin then player" >&2
  echo "       $0 plan [terraform args...]   # player then admin" >&2
  exit 1
}

CMD="${1:-}"
shift || true
[[ -n "$CMD" ]] || usage

case "$CMD" in
  apply)
    cd "$REPO_ROOT/infra/terraform"
    terraform init
    terraform apply "$@"
    cd "$REPO_ROOT/infra/terraform_admin"
    terraform init
    terraform apply "$@"
    ;;
  destroy)
    cd "$REPO_ROOT/infra/terraform_admin"
    terraform destroy "$@"
    cd "$REPO_ROOT/infra/terraform"
    terraform destroy "$@"
    ;;
  plan)
    # Admin plan reads player state; run only after player has been applied at least once.
    cd "$REPO_ROOT/infra/terraform"
    terraform init
    terraform plan "$@"
    cd "$REPO_ROOT/infra/terraform_admin"
    terraform init
    terraform plan "$@"
    ;;
  *)
    usage
    ;;
esac
