variable "region" {
  description = "AWS region for the state bucket, lock table, and IAM"
  type        = string
  default     = "eu-north-1"
}

variable "github_org" {
  description = "GitHub org or user that owns the Grandline repo (OIDC trust for the doorbell role)"
  type        = string
}

variable "github_repo" {
  description = "Grandline repository name (OIDC trust for the doorbell role)"
  type        = string
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub OIDC provider. Set false if this account already has token.actions.githubusercontent.com. The resource has prevent_destroy; a normal terraform destroy will not delete it."
  type        = bool
  default     = true
}

variable "github_oidc_thumbprints" {
  description = "GitHub Actions OIDC CA thumbprints (AWS still requires at least one)"
  type        = list(string)
  default = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}
