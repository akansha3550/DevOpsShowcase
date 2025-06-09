# This file configures the backend for Terraform state management using S3 and DynamoDB.
terraform {
  backend "s3" {
    bucket         = "deletelaters3backend"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
