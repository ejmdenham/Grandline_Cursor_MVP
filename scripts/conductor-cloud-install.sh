#!/usr/bin/env bash
# Conductor Cloud Computer — install software script (once per computer build).
# Base image has git, gh, node, python3 — not awscli. Do not skip aws just
# because terraform is already on PATH.
set -euo pipefail

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64) TF_ARCH=amd64; AWS_ARCH=x86_64 ;;
  aarch64|arm64) TF_ARCH=arm64; AWS_ARCH=aarch64 ;;
  *) echo "unsupported arch: $ARCH" >&2; exit 1 ;;
esac

ensure_unzip() {
  if command -v unzip >/dev/null 2>&1; then
    return 0
  fi
  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y unzip
  elif command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y unzip
  else
    echo "need unzip and neither dnf nor apt-get" >&2
    exit 1
  fi
}

if ! command -v aws >/dev/null 2>&1; then
  ensure_unzip
  curl -fsSL -o /tmp/awscliv2.zip \
    "https://awscli.amazonaws.com/awscli-exe-linux-${AWS_ARCH}.zip"
  rm -rf /tmp/aws-cli-install
  unzip -q -o /tmp/awscliv2.zip -d /tmp/aws-cli-install
  sudo /tmp/aws-cli-install/aws/install
  rm -rf /tmp/awscliv2.zip /tmp/aws-cli-install
fi
aws --version

if ! command -v terraform >/dev/null 2>&1; then
  ensure_unzip
  TF_VERSION="${TERRAFORM_VERSION:-1.9.8}"
  curl -fsSL -o /tmp/terraform.zip \
    "https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_${TF_ARCH}.zip"
  sudo unzip -o /tmp/terraform.zip -d /usr/local/bin
  rm -f /tmp/terraform.zip
fi
terraform version
