import express from 'express';
import * as k8s from '@kubernetes/client-node';

const app = express();
const port = 3000;


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// THIS is the fix — load config from cluster when running inside Kubernetes
const kc = new k8s.KubeConfig();
kc.loadFromCluster();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// Health check
app.get('/', (req, res) => {
    res.send('Backend running!');
});

// Get pods route
app.get('/pods', async (req, res) => {
    try {
        const response = await k8sApi.listPodForAllNamespaces();
        console.log('Raw response:', response); // 🔍 Add this line
        const pods = response.body.items;
        console.log('Fetched pods count:', Array.isArray(pods) ? pods.length : 'Not an array');
        res.json(pods);

    } catch (error) {
        console.error('Error fetching pods:', error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
