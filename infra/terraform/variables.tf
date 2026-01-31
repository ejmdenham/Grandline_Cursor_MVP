variable "region" {
  description = "AWS region for all resources"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "cognito_domain_prefix" {
  description = "Unique prefix for Cognito Hosted UI domain"
  type        = string
}

variable "stage" {
  description = "Deployment stage (e.g. dev, prod)"
  type        = string
  default     = "dev"
}

# Optional: set via TF_VAR_admin_bootstrap_password or terraform.tfvars (do not commit). Creates grandline.mvp@gmail.com in admin group.
variable "admin_bootstrap_password" {
  description = "Initial password for bootstrap admin user (grandline.mvp@gmail.com). Set out-of-band only; leave empty to skip."
  type        = string
  default     = ""
  sensitive   = true
}
