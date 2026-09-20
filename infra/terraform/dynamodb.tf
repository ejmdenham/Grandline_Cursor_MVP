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

# Race results — see docs/data-model.md. PK race_id, SK user_id. No GSI in Phase 6.
resource "aws_dynamodb_table" "race_results" {
  name         = "${var.project_name}-race-results-${var.stage}"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "race_id"
  range_key = "user_id"

  attribute {
    name = "race_id"
    type = "S"
  }

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}
