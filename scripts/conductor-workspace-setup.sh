#!/usr/bin/env bash
# Conductor workspace setup — refreshable assume-role profile, init Grandline backends.
# Requires Cloud Computer env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ROLE_ARN, AWS_REGION.
#
# Conductor injects the IAM *user* keys into every shell. Those env vars beat
# ~/.aws/config, so we persist them as [conductor-user] and UNSET AWS_ACCESS_KEY_*
# via ~/.profile and ~/.bashrc. Default profile is role_arn + source_profile so
# the SDK re-assumes when a session expires (do not freeze an STS snapshot).
set -euo pipefail

# Grandline stacks in the shared workshop bucket.
TF_ROOTS="${TF_ROOTS:-infra/terraform infra/terraform_admin}"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGION="${AWS_REGION:-eu-north-1}"

: "${AWS_ACCESS_KEY_ID:?set AWS_ACCESS_KEY_ID in Cloud Computer environment}"
: "${AWS_SECRET_ACCESS_KEY:?set AWS_SECRET_ACCESS_KEY in Cloud Computer environment}"
: "${AWS_ROLE_ARN:?set AWS_ROLE_ARN in Cloud Computer environment}"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI missing. Cloud Computer Install software must include awscli (paste conductor-cloud-install.sh). Rebuild the computer, then open a NEW workspace." >&2
  exit 1
fi

mkdir -p "${HOME}/.aws"
umask 077

printf '%s\n' \
  "[conductor-user]" \
  "aws_access_key_id = ${AWS_ACCESS_KEY_ID}" \
  "aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}" \
  > "${HOME}/.aws/credentials"

# Role max_session_duration is 12h; keep duration_seconds <= that.
# Do not write [default] keys — a frozen ASIA session expires and stays dead.
cat > "${HOME}/.aws/config" <<EOF
[profile conductor-user]
region = ${REGION}

[default]
region = ${REGION}
role_arn = ${AWS_ROLE_ARN}
source_profile = conductor-user
role_session_name = conductor-studio
duration_seconds = 43200
EOF

unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_SECURITY_TOKEN
unset AWS_PROFILE || true
export AWS_REGION="$REGION"
export AWS_SDK_LOAD_CONFIG=1

ENV_FILE="${HOME}/.conductor-studio-aws.env"
umask 077
cat > "$ENV_FILE" <<EOF
# Written by scripts/conductor-workspace-setup.sh — clear Conductor user env
# so default profile (role_arn + source_profile) can auto-refresh.
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_SECURITY_TOKEN
export AWS_REGION=${REGION}
export AWS_SDK_LOAD_CONFIG=1
unset AWS_PROFILE
EOF

MARKER="# conductor-studio-aws"
HOOK_LINE='[ -f "$HOME/.conductor-studio-aws.env" ] && . "$HOME/.conductor-studio-aws.env"'
ensure_hook() {
  local rc="$1"
  if [[ -f "$rc" ]] && grep -q "$MARKER" "$rc"; then
    return 0
  fi
  printf '\n%s\n%s\n' "$MARKER" "$HOOK_LINE" >> "$rc"
}
ensure_hook "${HOME}/.profile"
ensure_hook "${HOME}/.bashrc"

aws sts get-caller-identity

if [[ -z "$TF_ROOTS" ]] || ! command -v terraform >/dev/null 2>&1; then
  exit 0
fi

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
INIT_ARGS=(
  -input=false
  -reconfigure
  -backend-config="bucket=tfstate-${ACCOUNT_ID}"
  -backend-config="region=${REGION}"
  -backend-config="dynamodb_table=terraform-locks"
  -backend-config="encrypt=true"
)

for rel in $TF_ROOTS; do
  dir="$REPO_ROOT/$rel"
  if [[ -d "$dir" ]]; then
    (cd "$dir" && terraform init "${INIT_ARGS[@]}") || true
  fi
done

if [[ -x "$REPO_ROOT/scripts/gen-env.sh" ]]; then
  "$REPO_ROOT/scripts/gen-env.sh" || true
fi
if [[ -x "$REPO_ROOT/scripts/gen-env-admin-web.sh" ]]; then
  "$REPO_ROOT/scripts/gen-env-admin-web.sh" || true
fi
