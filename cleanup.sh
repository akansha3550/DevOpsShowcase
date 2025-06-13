#!/bin/bash
echo "[1/4] Cleaning apt cache..."
sudo apt clean && sudo apt autoremove -y

echo "[2/4] Removing old logs..."
sudo journalctl --vacuum-time=1d
sudo rm -rf /var/log/*.gz /var/log/*.[0-9] /var/log/*.log

echo "[3/4] Clearing containerd cache..."
sudo ctr content gc

echo "[4/4] Pruning orphaned overlayfs layers..."
sudo find /var/lib/rancher/k3s/agent/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots -name "committed" -type f -exec rm -f {} +
sudo ctr content gc

echo "Cleanup complete!"
