# Races table — see docs/data-model.md
resource "aws_dynamodb_table" "races" {
  name         = "${var.project_name}-races-${var.stage}"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "invite_code"
    type = "S"
  }

  global_secondary_index {
    name            = "by-invite-code"
    hash_key        = "invite_code"
    projection_type = "ALL"
  }

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}
