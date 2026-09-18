# Read player Terraform outputs from player state.
# Prerequisite: Run "terraform apply" in infra/terraform first so terraform.tfstate exists and
# includes cognito_user_pool_arn and races_table_arn (Phase 3 outputs). If you see
# "object does not have an attribute named races_table_arn", re-apply player Terraform.
data "terraform_remote_state" "player" {
  backend = "local"
  config = {
    path = "${path.module}/../terraform/terraform.tfstate"
  }
}
