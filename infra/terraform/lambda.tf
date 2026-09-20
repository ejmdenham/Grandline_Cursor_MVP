# Races API Lambda — get by invite/id, leaderboard, participation
# Before first apply: run "npm install" in infra/lambda/races so node_modules is included in the zip

data "archive_file" "races" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/races"
  output_path = "${path.module}/build/races.zip"
  excludes    = ["rank.test.js", "handler.test.js", "README.md"]
}

resource "aws_iam_role" "lambda_races" {
  name = "${var.project_name}-lambda-races-${var.stage}"

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

resource "aws_iam_role_policy" "lambda_races" {
  name = "dynamodb"
  role = aws_iam_role.lambda_races.id

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
          "dynamodb:GetItem",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.races.arn,
          "${aws_dynamodb_table.races.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.race_results.arn
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "races" {
  filename         = data.archive_file.races.output_path
  function_name    = "${var.project_name}-races-${var.stage}"
  role             = aws_iam_role.lambda_races.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.races.output_base64sha256
  runtime          = "nodejs20.x"

  environment {
    variables = {
      RACES_TABLE_NAME   = aws_dynamodb_table.races.name
      RESULTS_TABLE_NAME = aws_dynamodb_table.race_results.name
    }
  }

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}
