#!/bin/bash
set -e

# =============================================================================
# Install and Configure Argo CD for PDS E-Health
# Run this script on the Kubernetes master node
# =============================================================================

echo "==================================================================="
echo "Installing Argo CD for PDS E-Health"
echo "==================================================================="

# Create argocd namespace
echo "Step 1: Creating argocd namespace..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# Install Argo CD
echo "Step 2: Installing Argo CD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for Argo CD to be ready
echo "Step 3: Waiting for Argo CD components to be ready..."
sleep 30

echo "Waiting for argocd-server deployment..."
kubectl rollout status deployment/argocd-server -n argocd --timeout=300s

echo "Waiting for argocd-repo-server deployment..."
kubectl rollout status deployment/argocd-repo-server -n argocd --timeout=300s

echo "Waiting for argocd-application-controller statefulset..."
kubectl rollout status statefulset/argocd-application-controller -n argocd --timeout=300s

# Expose Argo CD via NodePort
echo "Step 4: Exposing Argo CD via NodePort..."
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort", "ports": [{"name": "https", "port": 443, "targetPort": 8080, "nodePort": 30443}]}}'

# Get initial admin password
echo "Step 5: Retrieving admin credentials..."
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

echo ""
echo "==================================================================="
echo "ARGO CD INSTALLATION COMPLETE"
echo "==================================================================="
echo ""
echo "Access Argo CD UI:"
echo "  URL: https://<NODE_PUBLIC_IP>:30443"
echo ""
echo "Login Credentials:"
echo "  Username: admin"
echo "  Password: $ARGOCD_PASSWORD"
echo ""
echo "==================================================================="
echo ""
echo "Next Steps:"
echo "1. Access the Argo CD UI using the credentials above"
echo "2. Change the admin password"
echo "3. Add your GitOps repository"
echo "4. Create the PDS application"
echo ""
echo "To install Argo CD CLI (optional):"
echo "  curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64"
echo "  chmod +x argocd"
echo "  sudo mv argocd /usr/local/bin/"
echo ""
echo "==================================================================="
