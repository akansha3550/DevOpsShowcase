const express = require('express');
const k8s = require('@kubernetes/client-node');
const app = express();
const port = 3000;

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.get('/pods', async (req, res) => {
    try {
        const pods = await k8sApi.listPodForAllNamespaces();
        res.json(pods.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`KubeVisualizer backend running at http://localhost:${port}`);
});
