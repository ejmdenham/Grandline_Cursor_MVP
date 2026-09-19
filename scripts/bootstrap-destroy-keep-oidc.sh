#!/usr/bin/env bash
# Destroy infra/bootstrap except the GitHub OIDC provider (left in AWS).
# After this, set create_github_oidc_provider = false so later applies look it up.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/infra/bootstrap"

if terraform state list 2>/dev/null | grep -q 'aws_iam_openid_connect_provider.github'; then
  terraform state rm 'aws_iam_openid_connect_provider.github[0]'
fi

terraform destroy "$@"
echo "OIDC provider token.actions.githubusercontent.com was not destroyed (removed from state only)."
