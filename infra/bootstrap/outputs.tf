output "account_id" {
  description = "AWS account id (used in tfstate bucket name)"
  value       = local.account_id
}

output "state_bucket" {
  description = "Shared S3 bucket for all Terraform state in this account"
  value       = aws_s3_bucket.tfstate.id
}

output "lock_table" {
  description = "DynamoDB table for Terraform state locking"
  value       = aws_dynamodb_table.locks.name
}

output "region" {
  description = "Region of the state bucket and lock table"
  value       = var.region
}

output "gha_deploy_role_arn" {
  description = "IAM role GitHub Actions assumes via OIDC (Grandline doorbell)"
  value       = aws_iam_role.gha_deploy.arn
}

output "studio_role_arn" {
  description = "IAM role Conductor workspaces assume (account workshop)"
  value       = aws_iam_role.studio.arn
}

output "studio_user_name" {
  description = "IAM user whose access keys go in Conductor Cloud Computer only"
  value       = aws_iam_user.studio.name
}

output "github_oidc_provider_arn" {
  description = "GitHub OIDC provider ARN in this account"
  value       = local.github_oidc_provider_arn
}
