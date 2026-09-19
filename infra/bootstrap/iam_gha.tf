# Grandline doorbell only. Trust is this repo; permission is AdministratorAccess
# so apply is not blocked by missing IAM actions. Other projects get their own
# GHA role + OIDC sub — do not widen this trust to every repo.

resource "aws_iam_role" "gha_deploy" {
  name = "grandline-gha-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.github_oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/main",
              "repo:${var.github_org}/${var.github_repo}:environment:dev",
            ]
          }
        }
      }
    ]
  })

  tags = {
    Purpose = "grandline-gha-deploy"
    Repo    = "${var.github_org}/${var.github_repo}"
    Managed = "conductor-studio-bootstrap"
  }
}

resource "aws_iam_role_policy_attachment" "gha_admin" {
  role       = aws_iam_role.gha_deploy.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
