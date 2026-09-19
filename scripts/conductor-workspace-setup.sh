#!/usr/bin/env bash
# Conductor workspace setup — assume conductor-studio and init Grandline backends.
# Requires Cloud Computer env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ROLE_ARN, AWS_REGION.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGION="${AWS_REGION:-eu-north-1}"

: "${AWS_ACCESS_KEY_ID:?set AWS_ACCESS_KEY_ID in Cloud Computer environment}"
: "${AWS_SECRET_ACCESS_KEY:?set AWS_SECRET_ACCESS_KEY in Cloud Computer environment}"
: "${AWS_ROLE_ARN:?set AWS_ROLE_ARN in Cloud Computer environment}"

mkdir -p "${HOME}/.aws"
umask 077

# Keep the IAM user keys as a profile; default profile becomes the assumed role.
printf '%s\n' \
  "[conductor-user]" \
  "aws_access_key_id = ${AWS_ACCESS_KEY_ID}" \
  "aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}" \
  > "${HOME}/.aws/credentials"

printf '%s\n' \
  "[profile conductor-user]" \
  "region = ${REGION}" \
  "[default]" \
  "region = ${REGION}" \
  > "${HOME}/.aws/config"

CREDS_JSON="$(aws sts assume-role \
  --profile conductor-user \
  --role-arn "${AWS_ROLE_ARN}" \
  --role-session-name "conductor-studio" \
  --duration-seconds 3600 \
  --output json)"

SESSION_KEY="$(printf '%s' "$CREDS_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["Credentials"]["AccessKeyId"])')"
SESSION_SECRET="$(printf '%s' "$CREDS_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["Credentials"]["SecretAccessKey"])')"
SESSION_TOKEN="$(printf '%s' "$CREDS_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["Credentials"]["SessionToken"])')"

cat >> "${HOME}/.aws/credentials" <<EOF

[default]
aws_access_key_id = ${SESSION_KEY}
aws_secret_access_key = ${SESSION_SECRET}
aws_session_token = ${SESSION_TOKEN}
EOF

export AWS_ACCESS_KEY_ID="$SESSION_KEY"
export AWS_SECRET_ACCESS_KEY="$SESSION_SECRET"
export AWS_SESSION_TOKEN="$SESSION_TOKEN"
export AWS_REGION="$REGION"
unset AWS_PROFILE || true

ENV_FILE="${HOME}/.conductor-studio-aws.env"
umask 077
cat > "$ENV_FILE" <<EOF
# Written by scripts/conductor-workspace-setup.sh — session, not the IAM user keys.
export AWS_ACCESS_KEY_ID=${SESSION_KEY}
export AWS_SECRET_ACCESS_KEY=${SESSION_SECRET}
export AWS_SESSION_TOKEN=${SESSION_TOKEN}
export AWS_REGION=${REGION}
unset AWS_PROFILE
EOF

PROFILE="${HOME}/.profile"
MARKER="# conductor-studio-aws"
if [[ -f "$PROFILE" ]] && grep -q "$MARKER" "$PROFILE"; then
  :
else
  printf '\n%s\n%s\n' "$MARKER" '[ -f "$HOME/.conductor-studio-aws.env" ] && . "$HOME/.conductor-studio-aws.env"' >> "$PROFILE"
fi

aws sts get-caller-identity

if [[ -d "$REPO_ROOT/infra/terraform" ]] && command -v terraform >/dev/null 2>&1; then
  ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
  INIT_ARGS=(
    -backend-config="bucket=tfstate-${ACCOUNT_ID}"
    -backend-config="region=${REGION}"
    -backend-config="dynamodb_table=terraform-locks"
    -backend-config="encrypt=true"
  )
  (cd "$REPO_ROOT/infra/terraform" && terraform init -reconfigure "${INIT_ARGS[@]}")
  if [[ -d "$REPO_ROOT/infra/terraform_admin" ]]; then
    (cd "$REPO_ROOT/infra/terraform_admin" && terraform init -reconfigure "${INIT_ARGS[@]}") || true
  fi
  if [[ -x "$REPO_ROOT/scripts/gen-env.sh" ]]; then
    "$REPO_ROOT/scripts/gen-env.sh" || true
  fi
fi
