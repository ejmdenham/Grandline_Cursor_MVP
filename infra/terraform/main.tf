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
  }

  # Optional: move state to S3 for team use. Uncomment and set bucket, key, region; then run terraform init -migrate-state
  # backend "s3" {
  #   bucket         = "grandline-terraform-state"
  #   key            = "phase1/terraform.tfstate"
  #   region         = "eu-north-1"
  #   encrypt        = true
  #   dynamodb_table = "grandline-terraform-locks"
  # }
}

provider "aws" {
  region = var.region
}
