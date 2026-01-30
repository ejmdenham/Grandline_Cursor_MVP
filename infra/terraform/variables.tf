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
