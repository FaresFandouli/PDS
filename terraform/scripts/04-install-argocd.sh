#!/bin/bash
set -e

# =============================================================================
# Script 4: Install Argo CD on Kubernetes Cluster
# Run this script on the MASTER node after cluster is ready
# =============================================================================

echo "==================================================================="
echo "Installing Argo CD"
echo "==================================================================="

# Create argocd namespace
echo "Creating argocd namespace..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# Install Argo CD
echo "Installing Argo CD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for Argo CD to be ready
echo "Waiting for Argo CD pods to be ready..."
sleep 30
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s || echo "Some pods may still be initializing..."

# Patch argocd-server to use NodePort
echo "Exposing Argo CD via NodePort..."
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort", "ports": [{"port": 443, "targetPort": 8080, "nodePort": 30443}]}}'

# Get initial admin password
echo ""
echo "==================================================================="
echo "ARGO CD INSTALLATION COMPLETE"
echo "==================================================================="
echo ""
echo "Argo CD UI is available at: https://<NODE_IP>:30443"
echo ""
echo "Default admin credentials:"
echo "  Username: admin"
echo "  Password: $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)"
echo ""
echo "==================================================================="
echo ""
echo "To get the password later, run:"
echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d"
echo ""
echo "==================================================================="
