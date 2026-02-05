terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "pds-ehealth"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

module "security" {
  source = "./modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  vpc_cidr     = var.vpc_cidr
}

module "ec2" {
  source = "./modules/ec2"

  project_name      = var.project_name
  environment       = var.environment
  instance_type     = var.instance_type
  key_name          = var.key_name
  subnet_id         = module.vpc.public_subnet_id
  security_group_id = module.security.k8s_security_group_id

  depends_on = [module.vpc, module.security]
}

resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/templates/inventory.tpl", {
    master_ip  = module.ec2.master_public_ip
    worker1_ip = module.ec2.worker1_public_ip
    worker2_ip = module.ec2.worker2_public_ip
    key_path   = var.private_key_path
  })
  filename = "${path.module}/inventory.ini"
}

resource "local_file" "k8s_setup_script" {
  content = templatefile("${path.module}/templates/k8s-setup.sh.tpl", {
    master_ip  = module.ec2.master_private_ip
    worker1_ip = module.ec2.worker1_private_ip
    worker2_ip = module.ec2.worker2_private_ip
  })
  filename = "${path.module}/scripts/k8s-setup.sh"
  file_permission = "0755"
}
