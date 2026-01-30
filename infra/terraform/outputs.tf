output "cognito_user_pool_id" {
  description = "Cognito User Pool id"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_endpoint" {
  description = "Cognito User Pool endpoint"
  value       = aws_cognito_user_pool.main.endpoint
}

output "cognito_app_client_id" {
  description = "Cognito App Client id (mobile)"
  value       = aws_cognito_user_pool_client.main.id
}

output "cognito_hosted_ui_domain" {
  description = "Cognito Hosted UI domain (prefix only; full URL is https://<this>.auth.<region>.amazoncognito.com)"
  value       = aws_cognito_user_pool_domain.main.domain
}

output "api_base_url" {
  description = "API Gateway HTTP API base URL (invoke URL)"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "races_table_name" {
  description = "DynamoDB races table name"
  value       = aws_dynamodb_table.races.name
}
