#!/bin/bash
set -e

# =============================================================================
# Complete Deployment Script for PDS E-Health
# Run this script on the Kubernetes master node after cluster setup
# =============================================================================

echo "==================================================================="
echo "PDS E-Health Complete Deployment"
echo "==================================================================="

# Variables - REPLACE THESE WITH YOUR VALUES
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-your-dockerhub-username}"
GITHUB_USERNAME="${GITHUB_USERNAME:-your-github-username}"

echo ""
echo "Configuration:"
echo "  Docker Hub Username: $DOCKERHUB_USERNAME"
echo "  GitHub Username: $GITHUB_USERNAME"
echo ""

# Step 1: Create namespace
echo "Step 1: Creating PDS namespace..."
kubectl apply -f base/namespace.yaml

# Step 2: Create Docker registry secret
echo "Step 2: Creating Docker registry secret..."
echo "Please enter your Docker Hub credentials:"
read -p "Docker Hub Username: " DOCKER_USER
read -s -p "Docker Hub Password/Token: " DOCKER_PASS
echo ""
read -p "Docker Hub Email: " DOCKER_EMAIL

kubectl create secret docker-registry docker-registry-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username="$DOCKER_USER" \
  --docker-password="$DOCKER_PASS" \
  --docker-email="$DOCKER_EMAIL" \
  --namespace=pds \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 3: Apply ConfigMaps and Secrets
echo "Step 3: Applying configuration..."
kubectl apply -f base/configmap.yaml
kubectl apply -f base/secrets.yaml

# Step 4: Deploy Infrastructure
echo "Step 4: Deploying infrastructure services..."
kubectl apply -f infrastructure/mysql.yaml
kubectl apply -f infrastructure/redis.yaml
kubectl apply -f infrastructure/keycloak.yaml

echo "Waiting for infrastructure to be ready..."
sleep 30
kubectl wait --for=condition=Ready pods -l app=mysql -n pds --timeout=300s || echo "MySQL may still be initializing..."
kubectl wait --for=condition=Ready pods -l app=redis -n pds --timeout=120s || echo "Redis may still be initializing..."

# Step 5: Deploy Core Services
echo "Step 5: Deploying core services..."
kubectl apply -f base/config-service.yaml
kubectl apply -f base/discovery-service.yaml

echo "Waiting for core services..."
sleep 30
kubectl wait --for=condition=Ready pods -l app=discovery-service -n pds --timeout=300s || echo "Discovery service may still be initializing..."

# Step 6: Deploy Application Services
echo "Step 6: Deploying application services..."
kubectl apply -f base/gateway-service.yaml
kubectl apply -f base/auth-service.yaml
kubectl apply -f base/clinic-service.yaml
kubectl apply -f base/medical-service.yaml
kubectl apply -f base/consultation-service.yaml

# Step 7: Deploy Ingress
echo "Step 7: Deploying ingress..."
kubectl apply -f infrastructure/ingress.yaml

echo ""
echo "==================================================================="
echo "DEPLOYMENT COMPLETE"
echo "==================================================================="
echo ""
echo "Checking pod status..."
kubectl get pods -n pds

echo ""
echo "Checking services..."
kubectl get svc -n pds

echo ""
echo "==================================================================="
echo "Access your application:"
echo "  Gateway: http://<NODE_IP>:30081"
echo "  Keycloak: http://<NODE_IP>:30080"
echo "==================================================================="
