# Admin web app hosting — S3 bucket, CloudFront (OAC), SPA default and error document

resource "aws_s3_bucket" "admin" {
  bucket = "${var.project_name}-admin-web-${var.stage}"

  tags = {
    Project = var.project_name
    Stage   = var.stage
  }
}

resource "aws_s3_bucket_public_access_block" "admin" {
  bucket = aws_s3_bucket.admin.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "admin" {
  name                              = "${var.project_name}-admin-oac-${var.stage}"
  description                       = "OAC for admin web S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                 = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_policy" "admin" {
  bucket = aws_s3_bucket.admin.id

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
        Resource = "${aws_s3_bucket.admin.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.admin.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.admin]
}

resource "aws_cloudfront_distribution" "admin" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Grandline admin web app"

  origin {
    domain_name              = aws_s3_bucket.admin.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.admin.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.admin.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.admin.id}"
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
