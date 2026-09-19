#!/usr/bin/env bash
# Destroy infra/bootstrap except:
#   - GitHub OIDC provider (account-wide handshake)
#   - conductor-studio user/role (Conductor Cloud Computer env vars stay valid)
# After this, set create_github_oidc_provider = false so later applies look OIDC up.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/infra/bootstrap"

state_rm_if_present() {
  local addr="$1"
  if terraform state list 2>/dev/null | grep -qxF "$addr"; then
    terraform state rm "$addr"
  fi
}

state_rm_if_present 'aws_iam_openid_connect_provider.github[0]'
state_rm_if_present aws_iam_user_policy.studio_assume
state_rm_if_present aws_iam_role_policy_attachment.studio_admin
state_rm_if_present aws_iam_role.studio
state_rm_if_present aws_iam_user.studio

terraform destroy "$@"
echo "Left in AWS (removed from state only): GitHub OIDC + conductor-studio user/role."
