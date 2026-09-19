#!/usr/bin/env bash
# Conductor Cloud Computer — install software script (once per computer build).
# Amazon Linux 2023 already has git, gh, node, python3, and typically awscli.
set -euo pipefail

if command -v terraform >/dev/null 2>&1; then
  terraform version
  exit 0
fi

TF_VERSION="${TERRAFORM_VERSION:-1.9.8}"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64) TF_ARCH=amd64 ;;
  aarch64|arm64) TF_ARCH=arm64 ;;
  *) echo "unsupported arch: $ARCH" >&2; exit 1 ;;
esac

sudo dnf install -y unzip
curl -fsSL -o /tmp/terraform.zip \
  "https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_${TF_ARCH}.zip"
sudo unzip -o /tmp/terraform.zip -d /usr/local/bin
rm -f /tmp/terraform.zip
terraform version
