#!/bin/bash
set -e

# =============================================================================
# Script 1: Initialize Kubernetes Master Node
# Run this script on the MASTER node after Terraform provisioning
# =============================================================================

echo "==================================================================="
echo "Initializing Kubernetes Master Node"
echo "==================================================================="

# Get the private IP of this instance
MASTER_IP=$(hostname -I | awk '{print $1}')
echo "Master IP: $MASTER_IP"

# Wait for cloud-init to complete
echo "Waiting for cloud-init to complete..."
cloud-init status --wait || true

# Verify prerequisites
echo "Verifying prerequisites..."
which kubeadm || { echo "kubeadm not found. Please wait for cloud-init to complete."; exit 1; }
which kubelet || { echo "kubelet not found. Please wait for cloud-init to complete."; exit 1; }
which kubectl || { echo "kubectl not found. Please wait for cloud-init to complete."; exit 1; }

# Initialize the cluster
echo ""
echo "Initializing Kubernetes cluster..."
sudo kubeadm init \
  --pod-network-cidr=10.244.0.0/16 \
  --apiserver-advertise-address=$MASTER_IP \
  --kubernetes-version=v1.31.0

# Configure kubectl
echo ""
echo "Configuring kubectl..."
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Install Calico CNI
echo ""
echo "Installing Calico CNI..."
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml

# Wait for system pods
echo ""
echo "Waiting for system pods to be ready..."
sleep 30
kubectl wait --for=condition=Ready pods --all -n kube-system --timeout=300s || echo "Some pods may still be initializing..."

# Generate and display join command
echo ""
echo "==================================================================="
echo "MASTER INITIALIZATION COMPLETE"
echo "==================================================================="
echo ""
echo "Join command for workers:"
echo ""
kubeadm token create --print-join-command
echo ""
echo "==================================================================="
echo ""
echo "Save the join command above and run it on each worker node."
echo "Then run: kubectl get nodes"
echo "==================================================================="
