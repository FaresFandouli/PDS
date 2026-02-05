#!/bin/bash

# =============================================================================
# Script 3: Verify Kubernetes Cluster Status
# Run this script on the MASTER node to verify cluster health
# =============================================================================

echo "==================================================================="
echo "Kubernetes Cluster Verification"
echo "==================================================================="

echo ""
echo "1. Node Status:"
echo "-------------------------------------------------------------------"
kubectl get nodes -o wide

echo ""
echo "2. System Pods Status:"
echo "-------------------------------------------------------------------"
kubectl get pods -n kube-system

echo ""
echo "3. Cluster Info:"
echo "-------------------------------------------------------------------"
kubectl cluster-info

echo ""
echo "4. Component Status:"
echo "-------------------------------------------------------------------"
kubectl get componentstatuses 2>/dev/null || echo "(componentstatuses deprecated in newer versions)"

echo ""
echo "5. Checking all nodes are Ready:"
echo "-------------------------------------------------------------------"
NOT_READY=$(kubectl get nodes --no-headers | grep -v "Ready" | wc -l)
if [ "$NOT_READY" -eq 0 ]; then
    echo "All nodes are Ready!"
else
    echo "WARNING: $NOT_READY node(s) are not Ready"
    kubectl get nodes --no-headers | grep -v "Ready"
fi

echo ""
echo "==================================================================="
echo "Cluster Verification Complete"
echo "==================================================================="
