import express from 'express';
import * as k8s from '@kubernetes/client-node';

const app = express();
const port = 3000;

// Disable TLS verification (⚠️ DEV ONLY!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Load kubeconfig (mapped into container)
const kc = new k8s.KubeConfig();
kc.loadFromFile('/root/.kube/config');

// Optional: mark cluster as skipping TLS
const cluster = kc.getCurrentCluster();
if (cluster) {
    cluster.skipTLSVerify = true;
}

// Create API client
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// Health check route
app.get('/', (req, res) => {
    res.send('✅ KubeVisualizer backend is up and running!');
});

// Get all pods
app.get('/pods', async (req, res) => {
    try {
        const pods = await k8sApi.listPodForAllNamespaces();
        res.json(pods.body);
    } catch (error) {
        console.error('Error fetching pods:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 KubeVisualizer backend running at http://localhost:${port}`);
});
