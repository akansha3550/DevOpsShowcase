// This is a Node.js backend server that interacts with Kubernetes to fetch pod information.
import express from 'express';
import * as k8s from '@kubernetes/client-node';

const app = express();
const port = 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

app.get('/', (req, res) => {
    res.send('Backend running!');
});

// Original pods route
app.get('/api/pods', async (req, res) => {
    try {
        const podsList = await k8sApi.listPodForAllNamespaces();
        const pods = (podsList.items || []).map(pod => ({
            metadata: {
                name: pod.metadata?.name,
                namespace: pod.metadata?.namespace,
            },
            status: {
                phase: pod.status?.phase,
                startTime: pod.status?.startTime,
            },
            spec: {
                nodeName: pod.spec?.nodeName,
            }
        }));
        res.json({ items: pods });
    } catch (error) {
        console.error('Error fetching pods:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api', (req, res) => {
    res.send('Backend API root');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running at http://0.0.0.0:${port}`);
});
