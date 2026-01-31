# Cognito User Pool — sign up, sign in, session (refresh)
# See docs/api/auth.md

resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-player-${var.stage}"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "preferred_username"
    attribute_data_type = "String"
    required            = false
    mutable             = true
  }

  # No MFA for MVP
  mfa_configuration = "OFF"

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-mobile-${var.stage}"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  # Placeholder for Phase 2; mobile app will use app scheme (e.g. grandline://callback)
  callback_urls = [
    "https://localhost/callback"
  ]
  logout_urls = [
    "https://localhost/signout"
  ]

  allowed_oauth_flows_user_pool_client = false

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
  refresh_token_validity  = 30
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.cognito_domain_prefix
  user_pool_id = aws_cognito_user_pool.main.id
}

# Admin group — users in this group can use the admin API and web app
resource "aws_cognito_user_group" "admin" {
  name         = "admin"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Optional bootstrap admin user (only created when admin_bootstrap_password is set)
resource "aws_cognito_user" "bootstrap_admin" {
  count = length(var.admin_bootstrap_password) > 0 ? 1 : 0

  user_pool_id = aws_cognito_user_pool.main.id
  username     = "grandline.mvp@gmail.com"
  password     = var.admin_bootstrap_password

  message_action = "SUPPRESS" # do not send welcome email with temp password

  lifecycle {
    ignore_changes = [password]
  }
}

resource "aws_cognito_user_in_group" "bootstrap_admin" {
  count = length(var.admin_bootstrap_password) > 0 ? 1 : 0

  user_pool_id = aws_cognito_user_pool.main.id
  group_name   = aws_cognito_user_group.admin.name
  username     = aws_cognito_user.bootstrap_admin[0].username
}
