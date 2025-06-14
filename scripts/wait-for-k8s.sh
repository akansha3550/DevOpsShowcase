#!/bin/bash
# Wait for Kubernetes API server to be ready

set -e

echo "Waiting for Kubernetes API server to be ready..."

until kubectl get nodes &>/dev/null; do
    echo "Kubernetes API server is not ready yet. Waiting..."
    sleep 5
done

echo "Kubernetes API server is ready."
