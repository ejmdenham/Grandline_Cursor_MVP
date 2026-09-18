# Run gen-env-admin-web.sh after apply so apps/web/.env stays in sync with outputs.
# Runs from this directory; script resolves repo root and writes apps/web/.env.
resource "null_resource" "gen_env_admin_web" {
  triggers = {
    admin_api_url          = aws_apigatewayv2_api.admin.api_endpoint
    admin_cognito_client_id = aws_cognito_user_pool_client.admin.id
  }

  provisioner "local-exec" {
    command     = "bash ../../scripts/gen-env-admin-web.sh"
    working_dir = path.module
  }
}
