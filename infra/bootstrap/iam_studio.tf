# Org-wide workshop identity for Conductor Cloud Computer.
# Full access in THIS account so any repo with state in tfstate-<account> can terraform.
# Blast radius = this AWS account. Do not reuse these keys in a prod account.
#
# prevent_destroy: Conductor env vars (AWS_REGION, AWS_ROLE_ARN, access key pair)
# stay valid across Grandline player/admin teardown AND bootstrap destroy.
# Access keys are created out-of-band (aws iam create-access-key) and are not
# Terraform resources; deleting the user would still kill them, so the user
# must not be destroyed.

resource "aws_iam_user" "studio" {
  name = "conductor-studio"

  tags = {
    Purpose = "conductor-studio-workshop"
    Managed = "conductor-studio-bootstrap"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_role" "studio" {
  name = "conductor-studio"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_user.studio.arn
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Purpose = "conductor-studio-workshop"
    Managed = "conductor-studio-bootstrap"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_role_policy_attachment" "studio_admin" {
  role       = aws_iam_role.studio.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_user_policy" "studio_assume" {
  name = "assume-conductor-studio"
  user = aws_iam_user.studio.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sts:AssumeRole"
        Resource = aws_iam_role.studio.arn
      }
    ]
  })

  lifecycle {
    prevent_destroy = true
  }
}
