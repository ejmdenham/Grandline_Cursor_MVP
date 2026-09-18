# Admin HTTP API — JWT authorizer (same pool, admin client); routes for admin/races and admin/users

resource "aws_apigatewayv2_api" "admin" {
  name          = "${var.project_name}-admin-api-${var.stage}"
  protocol_type = "HTTP"
  description   = "Grandline admin API"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
}

resource "aws_apigatewayv2_authorizer" "admin" {
  api_id           = aws_apigatewayv2_api.admin.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "admin-jwt"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.admin.id]
    issuer   = "https://cognito-idp.${var.region}.amazonaws.com/${data.terraform_remote_state.player.outputs.cognito_user_pool_id}"
  }
}

resource "aws_apigatewayv2_integration" "admin_races" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_races.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "admin_users" {
  api_id                 = aws_apigatewayv2_api.admin.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin_users.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_stage" "admin" {
  api_id      = aws_apigatewayv2_api.admin.id
  name        = "$default"
  auto_deploy = true
}

# Routes — admin/races
resource "aws_apigatewayv2_route" "admin_races_list" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "GET /admin/races"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_races.id}"
}

resource "aws_apigatewayv2_route" "admin_races_post" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "POST /admin/races"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_races.id}"
}

resource "aws_apigatewayv2_route" "admin_races_get" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "GET /admin/races/{id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_races.id}"
}

resource "aws_apigatewayv2_route" "admin_races_put" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "PUT /admin/races/{id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_races.id}"
}

resource "aws_apigatewayv2_route" "admin_races_delete" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "DELETE /admin/races/{id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_races.id}"
}

# Routes — admin/users
resource "aws_apigatewayv2_route" "admin_users_list" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "GET /admin/users"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_users.id}"
}

resource "aws_apigatewayv2_route" "admin_users_post" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "POST /admin/users"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_users.id}"
}

resource "aws_apigatewayv2_route" "admin_users_disable" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "POST /admin/users/{username}/disable"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_users.id}"
}

resource "aws_apigatewayv2_route" "admin_users_delete" {
  api_id             = aws_apigatewayv2_api.admin.id
  route_key          = "DELETE /admin/users/{username}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.admin.id
  target             = "integrations/${aws_apigatewayv2_integration.admin_users.id}"
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "admin_races" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_races.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*"
}

resource "aws_lambda_permission" "admin_users" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_users.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.admin.execution_arn}/*/*"
}
