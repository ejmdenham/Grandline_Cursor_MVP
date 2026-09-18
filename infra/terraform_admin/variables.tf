variable "region" {
  description = "AWS region (must match player Terraform)"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "grandline"
}

variable "stage" {
  description = "Deployment stage (e.g. dev, prod)"
  type        = string
  default     = "dev"
}

# Callback URL for admin web app after Hosted UI login (e.g. https://admin.example.com/callback or http://localhost:5173/callback for dev)
variable "admin_callback_url" {
  description = "OAuth callback URL for admin Cognito app client (admin web origin)"
  type        = string
  default     = "http://localhost:5173/callback"
}

# Set to true to create S3 bucket and CloudFront for admin web app; Phase 3.5 reactivates this.
variable "enable_admin_hosting" {
  description = "Create S3 + CloudFront for admin web app (default false; run locally with npm run dev until Phase 3.5)"
  type        = bool
  default     = false
}
