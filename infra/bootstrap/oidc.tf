# Account-wide GitHub↔AWS handshake. Shared by every repo's GHA deploy role.
# Must outlive this bootstrap stack (Grandline doorbell, future otherapp-gha-deploy, …).
# prevent_destroy: terraform destroy / count=0 will refuse rather than delete it.
# To destroy the rest of bootstrap and keep OIDC in AWS, drop it from state first:
#   terraform state rm 'aws_iam_openid_connect_provider.github[0]'
#   terraform destroy
# or: ./scripts/bootstrap-destroy-keep-oidc.sh

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = var.github_oidc_thumbprints

  tags = {
    Purpose = "github-actions-oidc"
    Managed = "conductor-studio-bootstrap"
  }

  lifecycle {
    prevent_destroy = true
  }
}
