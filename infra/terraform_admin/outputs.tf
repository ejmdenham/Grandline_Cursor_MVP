output "admin_api_url" {
  description = "Admin API Gateway HTTP API base URL"
  value       = aws_apigatewayv2_api.admin.api_endpoint
}

output "admin_cloudfront_url" {
  description = "CloudFront URL for admin web app"
  value       = "https://${aws_cloudfront_distribution.admin.domain_name}"
}

output "admin_cognito_client_id" {
  description = "Cognito App Client id for admin web app"
  value       = aws_cognito_user_pool_client.admin.id
}

output "admin_s3_bucket" {
  description = "S3 bucket name for admin web app assets"
  value       = aws_s3_bucket.admin.id
}
