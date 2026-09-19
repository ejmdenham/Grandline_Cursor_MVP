# Read player Terraform outputs from shared S3 state in this AWS account.
# Prerequisite: player stack applied at least once; bootstrap bucket tfstate-<account_id> exists.
# First-time move from local state: terraform init -migrate-state with the same -backend-config flags
# (Pilot only — see docs/runbooks/studio-aws.md).

data "aws_caller_identity" "current" {}

data "terraform_remote_state" "player" {
  backend = "s3"
  config = {
    bucket = "tfstate-${data.aws_caller_identity.current.account_id}"
    key    = "grandline/player/terraform.tfstate"
    region = var.region
  }
}
