# Grandline Phase 3 — Admin infrastructure
# Depends on player Terraform outputs: cognito_user_pool_id, cognito_user_pool_arn, races_table_name, races_table_arn

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
}

provider "aws" {
  region = var.region
}
