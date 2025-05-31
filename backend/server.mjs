import express from 'express';
import * as k8s from '@kubernetes/client-node';

const app = express();
const port = 3000;

// Insecure TLS override (keep only for local testing)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Load cluster config (works inside a Kubernetes Pod)
const kc = new k8s.KubeConfig();
kc.loadFromCluster();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// Health check
app.get('/', (req, res) => {
    res.send('Backend running!');
});

// Pods route
app.get('/pods', async (req, res) => {
    try {
        const response = await k8sApi.listPodForAllNamespaces();

        // Safety checks and logging
        if (!response || !response.body) {
            console.error('No response body from Kubernetes API');
            return res.status(500).json({ error: 'No response body from Kubernetes API' });
        }

        const pods = response.body.items;

        if (!Array.isArray(pods)) {
            console.error('Invalid pods structure. Expected an array.');
            return res.status(500).json({ error: 'Unexpected pods structure' });
        }

        console.log('Fetched pods count:', pods.length);
        res.json(pods);

    } catch (error) {
        console.error('Error fetching pods:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
