#!/usr/bin/env bash
# Write infra/backend.hcl with tfstate-<account_id> from the current AWS caller.
# Does not apply or migrate state.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
REGION="${AWS_REGION:-eu-north-1}"
cat > "$REPO_ROOT/infra/backend.hcl" <<EOF
bucket         = "tfstate-${ACCOUNT_ID}"
region         = "${REGION}"
dynamodb_table = "terraform-locks"
encrypt        = true
EOF
echo "Wrote $REPO_ROOT/infra/backend.hcl (bucket tfstate-${ACCOUNT_ID})"
