output "k8s_security_group_id" {
  description = "Security group ID for Kubernetes cluster"
  value       = aws_security_group.k8s_cluster.id
}
