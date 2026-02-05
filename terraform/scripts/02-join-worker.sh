#!/bin/bash
set -e

# =============================================================================
# Script 2: Join Worker Node to Kubernetes Cluster
# Run this script on each WORKER node
# Usage: ./02-join-worker.sh <join-token> <ca-cert-hash> <master-ip>
# =============================================================================

if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <join-token> <ca-cert-hash> <master-ip>"
    echo ""
    echo "Example:"
    echo "  $0 abcdef.0123456789abcdef sha256:xxx 10.0.1.100"
    echo ""
    echo "Get these values from the master node by running:"
    echo "  kubeadm token create --print-join-command"
    exit 1
fi

JOIN_TOKEN=$1
CA_CERT_HASH=$2
MASTER_IP=$3

echo "==================================================================="
echo "Joining Worker Node to Kubernetes Cluster"
echo "==================================================================="
echo "Master IP: $MASTER_IP"
echo "Token: $JOIN_TOKEN"
echo "==================================================================="

# Wait for cloud-init to complete
echo "Waiting for cloud-init to complete..."
cloud-init status --wait || true

# Verify prerequisites
echo "Verifying prerequisites..."
which kubeadm || { echo "kubeadm not found. Please wait for cloud-init to complete."; exit 1; }

# Join the cluster
echo ""
echo "Joining cluster..."
sudo kubeadm join $MASTER_IP:6443 \
  --token $JOIN_TOKEN \
  --discovery-token-ca-cert-hash $CA_CERT_HASH

echo ""
echo "==================================================================="
echo "WORKER NODE JOINED SUCCESSFULLY"
echo "==================================================================="
echo ""
echo "Verify on master node with: kubectl get nodes"
echo "==================================================================="
