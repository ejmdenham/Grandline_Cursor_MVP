variable "region" {
  description = "AWS region (must match player Terraform)"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "stage" {
  description = "Deployment stage (e.g. dev, prod)"
  type        = string
  default     = "dev"
}

# From player Terraform: terraform output -raw cognito_user_pool_id
variable "cognito_user_pool_id" {
  description = "Cognito User Pool id (from player Terraform output)"
  type        = string
}

# From player Terraform: terraform output -raw cognito_user_pool_arn
variable "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN (from player Terraform output)"
  type        = string
}

# From player Terraform: terraform output -raw races_table_name
variable "races_table_name" {
  description = "DynamoDB races table name (from player Terraform output)"
  type        = string
}

# From player Terraform: terraform output -raw races_table_arn
variable "races_table_arn" {
  description = "DynamoDB races table ARN (from player Terraform output)"
  type        = string
}

# Callback URL for admin web app after Hosted UI login (e.g. https://admin.example.com/callback or http://localhost:5173/callback for dev)
variable "admin_callback_url" {
  description = "OAuth callback URL for admin Cognito app client (admin web origin)"
  type        = string
}
