# Admin web app client — same user pool, separate client for Hosted UI callback at admin origin

resource "aws_cognito_user_pool_client" "admin" {
  name         = "${var.project_name}-admin-web-${var.stage}"
  user_pool_id = var.cognito_user_pool_id

  generate_secret = false

  # Hosted UI: authorization code flow
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]

  callback_urls = [
    var.admin_callback_url,
    "http://localhost:5173/callback",
    "http://localhost:5173"
  ]
  logout_urls = [
    "http://localhost:5173/"
  ]

  supported_identity_providers = ["COGNITO"]

  read_attributes = [
    "email",
    "email_verified",
    "preferred_username"
  ]
  write_attributes = [
    "email",
    "preferred_username"
  ]

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30
}
