output "master_public_ip" {
  description = "Public IP of master node"
  value       = aws_instance.master.public_ip
}

output "master_private_ip" {
  description = "Private IP of master node"
  value       = aws_instance.master.private_ip
}

output "worker1_public_ip" {
  description = "Public IP of worker1"
  value       = aws_instance.worker1.public_ip
}

output "worker1_private_ip" {
  description = "Private IP of worker1"
  value       = aws_instance.worker1.private_ip
}

output "worker2_public_ip" {
  description = "Public IP of worker2"
  value       = aws_instance.worker2.public_ip
}

output "worker2_private_ip" {
  description = "Private IP of worker2"
  value       = aws_instance.worker2.private_ip
}

output "master_instance_id" {
  description = "Instance ID of master"
  value       = aws_instance.master.id
}

output "worker1_instance_id" {
  description = "Instance ID of worker1"
  value       = aws_instance.worker1.id
}

output "worker2_instance_id" {
  description = "Instance ID of worker2"
  value       = aws_instance.worker2.id
}
