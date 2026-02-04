output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "master_public_ip" {
  description = "Public IP of the Kubernetes master node"
  value       = module.ec2.master_public_ip
}

output "master_private_ip" {
  description = "Private IP of the Kubernetes master node"
  value       = module.ec2.master_private_ip
}

output "worker1_public_ip" {
  description = "Public IP of worker node 1"
  value       = module.ec2.worker1_public_ip
}

output "worker1_private_ip" {
  description = "Private IP of worker node 1"
  value       = module.ec2.worker1_private_ip
}

output "worker2_public_ip" {
  description = "Public IP of worker node 2"
  value       = module.ec2.worker2_public_ip
}

output "worker2_private_ip" {
  description = "Private IP of worker node 2"
  value       = module.ec2.worker2_private_ip
}

output "ssh_connection_master" {
  description = "SSH command to connect to master"
  value       = "ssh -i ${var.private_key_path} ubuntu@${module.ec2.master_public_ip}"
}

output "ssh_connection_worker1" {
  description = "SSH command to connect to worker1"
  value       = "ssh -i ${var.private_key_path} ubuntu@${module.ec2.worker1_public_ip}"
}

output "ssh_connection_worker2" {
  description = "SSH command to connect to worker2"
  value       = "ssh -i ${var.private_key_path} ubuntu@${module.ec2.worker2_public_ip}"
}

output "kubeadm_join_command_hint" {
  description = "Hint for getting kubeadm join command"
  value       = "Run 'kubeadm token create --print-join-command' on master to get the join command for workers"
}
