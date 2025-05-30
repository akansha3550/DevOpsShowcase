import express from 'express';
import * as k8s from '@kubernetes/client-node';

const app = express();
const port = 3000;


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const kc = new k8s.KubeConfig();


try {
    kc.loadFromCluster();
    console.log("Loaded Kubernetes config from cluster");
} catch (err) {
    console.warn("Failed to load in-cluster config, falling back to local");
    kc.loadFromDefault();
}


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
