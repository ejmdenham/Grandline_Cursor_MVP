# Admin Lambdas — admin-races (CRUD), admin-users (list/create/disable/delete)
# Before first apply: run "npm install" in infra/lambda/admin-races and infra/lambda/admin-users

data "archive_file" "admin_races" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/admin-races"
  output_path = "${path.module}/build/admin-races.zip"
}

data "archive_file" "admin_users" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/admin-users"
  output_path = "${path.module}/build/admin-users.zip"
}

# --- admin-races: DynamoDB races table (Scan, Put, Get, Update, Delete) ---

resource "aws_iam_role" "lambda_admin_races" {
  name = "${var.project_name}-lambda-admin-races-${var.stage}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_admin_races" {
  name = "dynamodb-logs"
  role = aws_iam_role.lambda_admin_races.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.region}:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query"
        ]
        Resource = [
          var.races_table_arn,
          "${var.races_table_arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "admin_races" {
  filename         = data.archive_file.admin_races.output_path
  function_name    = "${var.project_name}-admin-races-${var.stage}"
  role             = aws_iam_role.lambda_admin_races.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.admin_races.output_base64sha256
  runtime          = "nodejs20.x"

  environment {
    variables = {
      RACES_TABLE_NAME = var.races_table_name
    }
  }

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}

# --- admin-users: Cognito ListUsers, AdminCreateUser, AdminDisableUser, AdminDeleteUser ---

resource "aws_iam_role" "lambda_admin_users" {
  name = "${var.project_name}-lambda-admin-users-${var.stage}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_admin_users" {
  name = "cognito-logs"
  role = aws_iam_role.lambda_admin_users.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.region}:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:ListUsers",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminDisableUser",
          "cognito-idp:AdminDeleteUser"
        ]
        Resource = [var.cognito_user_pool_arn]
      }
    ]
  })
}

resource "aws_lambda_function" "admin_users" {
  filename         = data.archive_file.admin_users.output_path
  function_name    = "${var.project_name}-admin-users-${var.stage}"
  role             = aws_iam_role.lambda_admin_users.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.admin_users.output_base64sha256
  runtime          = "nodejs20.x"

  environment {
    variables = {
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
    }
  }

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}
