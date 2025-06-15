// import express from 'express';
// import * as k8s from '@kubernetes/client-node';

// const app = express();
// const port = 3000;

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// const kc = new k8s.KubeConfig();
// kc.loadFromDefault();

// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// app.get('/', (req, res) => {
//     res.send('Backend running!');
// });

// app.get('/pods', async (req, res) => {
//     try {
//         const podsList = await k8sApi.listPodForAllNamespaces();

//         if (!podsList || !podsList.items) {
//             console.error('Invalid response from Kubernetes API');
//             return res.status(500).json({ error: 'Invalid response from Kubernetes API' });
//         }

//         const pods = podsList.items;

//         const simplifiedPods = pods.map(pod => ({
//             metadata: {
//                 name: pod.metadata?.name,
//                 namespace: pod.metadata?.namespace,
//             },
//             status: {
//                 phase: pod.status?.phase,
//                 startTime: pod.status?.startTime,
//             },
//             spec: {
//                 nodeName: pod.spec?.nodeName,
//             }
//         }));

//         res.json({ items: simplifiedPods });
//     } catch (error) {
//         console.error('Error fetching pods:', error);
//         res.status(500).json({ error: error.message });
//     }
// });
// app.listen(port, '0.0.0.0', () => {
//     console.log(`Backend running at http://0.0.0.0:${port}`);
// });



//testing purpose

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


// New route added for /api/pods to match frontend call
app.get('/api/pods', (req, res) => {
    // Simply redirect to /pods
    res.redirect('/pods');
});

app.get('/api', (req, res) => {
    res.send('Backend API root');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running at http://0.0.0.0:${port}`);
});
