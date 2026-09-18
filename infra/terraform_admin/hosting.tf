# Admin web app hosting — S3 bucket, CloudFront (OAC), SPA default and error document
# Only created when enable_admin_hosting = true (Phase 3.5).

resource "aws_s3_bucket" "admin" {
  count  = var.enable_admin_hosting ? 1 : 0
  bucket = "${var.project_name}-admin-web-${var.stage}"

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}

resource "aws_s3_bucket_public_access_block" "admin" {
  count  = var.enable_admin_hosting ? 1 : 0
  bucket = aws_s3_bucket.admin[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "admin" {
  count                               = var.enable_admin_hosting ? 1 : 0
  name                                = "${var.project_name}-admin-oac-${var.stage}"
  description                         = "OAC for admin web S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                   = "always"
  signing_protocol                    = "sigv4"
}

resource "aws_s3_bucket_policy" "admin" {
  count  = var.enable_admin_hosting ? 1 : 0
  bucket = aws_s3_bucket.admin[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.admin[0].arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.admin[0].arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.admin]
}

resource "aws_cloudfront_distribution" "admin" {
  count               = var.enable_admin_hosting ? 1 : 0
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Grandline admin web app"

  origin {
    domain_name              = aws_s3_bucket.admin[0].bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.admin[0].id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.admin[0].id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.admin[0].id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # SPA: 403/404 from S3 -> return index.html so client router can handle
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}
