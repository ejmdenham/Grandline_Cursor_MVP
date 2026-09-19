terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Bootstrap state stays local on the laptop that applies it (chicken-and-egg).
# Do not point this stack at the bucket it creates.
