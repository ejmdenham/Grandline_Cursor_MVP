# Grandline Phase 1 — Backend foundation and auth
# Region: eu-north-1 (set in variables.tf)

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }

  # Remaining backend settings (bucket, region, lock table) come from
  # -backend-config (see scripts/infra.sh and infra/backend.hcl.example).
  backend "s3" {
    key = "grandline/player/terraform.tfstate"
  }
}

provider "aws" {
  region = var.region
}
