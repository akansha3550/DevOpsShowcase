// // import express from 'express';
// // import * as k8s from '@kubernetes/client-node';

// // const app = express();
// // const port = 3000;

// // // For local testing only — disables TLS cert verification
// // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// // // Load Kubernetes config from your environment (default location: ~/.kube/config)
// // const kc = new k8s.KubeConfig();
// // kc.loadFromDefault();

// // const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// // // Health check endpoint
// // app.get('/', (req, res) => {
// //     res.send('Backend running!');
// // });

// // // Endpoint to fetch and display Kubernetes pods
// // app.get('/pods', async (req, res) => {
// //     try {
// //         const podsList = await k8sApi.listPodForAllNamespaces();

// //         if (!podsList || !podsList.items) {
// //             console.error('Invalid response from Kubernetes API');
// //             return res.status(500).send('<h2>Invalid response from Kubernetes API</h2>');
// //         }

// //         const pods = podsList.items;

// //         const simplifiedPods = pods.map(pod => ({
// //             name: pod.metadata?.name,
// //             namespace: pod.metadata?.namespace,
// //             status: pod.status?.phase,
// //             podIP: pod.status?.podIP || 'N/A',
// //             nodeName: pod.spec?.nodeName || 'N/A',
// //             image: pod.spec?.containers?.map(c => c.image).join(', ') || 'N/A',
// //             startTime: pod.status?.startTime,
// //         }));

// //         // Generate HTML table
// //         const tableRows = simplifiedPods.map(pod => `
// //             <tr>
// //                 <td>${pod.name}</td>
// //                 <td>${pod.namespace}</td>
// //                 <td>${pod.status}</td>
// //                 <td>${pod.podIP}</td>
// //                 <td>${pod.nodeName}</td>
// //                 <td>${pod.image}</td>
// //                 <td>${new Date(pod.startTime).toLocaleString()}</td>
// //             </tr>
// //         `).join('');

// //         const html = `
// //             <html>
// //             <head>
// //                 <title>Kubernetes Pods</title>
// //                 <style>
// //                     body { font-family: Arial, sans-serif; margin: 20px; }
// //                     table { border-collapse: collapse; width: 100%; }
// //                     th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
// //                     th { background-color: #f2f2f2; }
// //                     tr:hover { background-color: #f9f9f9; }
// //                 </style>
// //             </head>
// //             <body>
// //                 <h2>Kubernetes Pods</h2>
// //                 <table>
// //                     <thead>
// //                         <tr>
// //                             <th>Name</th>
// //                             <th>Namespace</th>
// //                             <th>Status</th>
// //                             <th>Pod IP</th>
// //                             <th>Node</th>
// //                             <th>Image</th>
// //                             <th>Start Time</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         ${tableRows}
// //                     </tbody>
// //                 </table>
// //             </body>
// //             </html>
// //         `;

// //         res.send(html);

// //     } catch (error) {
// //         console.error('Error fetching pods:', error);
// //         res.status(500).send(`<pre>${error.message}\n\n${error.stack}</pre>`);
// //     }
// // });

// // // Start the backend server
// // app.listen(port, () => {
// //     console.log(`Backend listening at http://localhost:${port}`);
// // });




// // for testing

// import express from 'express';
// import * as k8s from '@kubernetes/client-node';

// const app = express();
// const port = 3000;

// // For local testing only — disables TLS cert verification
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// // Load Kubernetes config from your environment (default location: ~/.kube/config)
// const kc = new k8s.KubeConfig();
// kc.loadFromDefault();

// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// // Health check endpoint
// app.get('/', (req, res) => {
//     res.send('Backend running!');
// });

// // ✅ JSON endpoint to fetch Kubernetes pods
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

// // Start the backend server
// // app.listen(port, () => {
// //     console.log(`Backend listening at http://localhost:${port}`);
// // });

// app.listen(port, '0.0.0.0', () => {
//     console.log(`Backend listening at http://0.0.0.0:${port}`);
// });







// import express from 'express';
// import * as k8s from '@kubernetes/client-node';
// import fetch from 'node-fetch'; // ✅ ADD THIS

// const app = express();
// const port = 5000; // ✅ Must match your frontend container port

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// // Load K8s config (you already had this)
// const kc = new k8s.KubeConfig();
// kc.loadFromDefault();

// const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// // 🟢 Health check
// app.get('/', (req, res) => {
//     res.send('Frontend server is running');
// });

// // 🟢 This is the PROXY — your frontend React will hit this!
// app.get('/pods', async (req, res) => {
//     try {
//         const response = await fetch("http://backend-service:5000/pods"); // 🔁 Your backend-service
//         const data = await response.json();
//         res.json(data); // return it to frontend
//     } catch (error) {
//         console.error('Error proxying to backend-service:', error);
//         res.status(500).json({ error: 'Failed to proxy to backend-service' });
//     }
// });

// // Serve React build (make sure you build React before Dockerizing)
// app.use(express.static("build"));

// // Catch-all for React SPA routes
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve("build", "index.html"));
// });

// app.listen(port, '0.0.0.0', () => {
//     console.log(`Frontend server running at http://0.0.0.0:${port}`);
// });


//testing
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

app.get('/pods', async (req, res) => {
    try {
        const podsList = await k8sApi.listPodForAllNamespaces();

        if (!podsList || !podsList.items) {
            console.error('Invalid response from Kubernetes API');
            return res.status(500).json({ error: 'Invalid response from Kubernetes API' });
        }

        const pods = podsList.items;

        const simplifiedPods = pods.map(pod => ({
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

        res.json({ items: simplifiedPods });
    } catch (error) {
        console.error('Error fetching pods:', error);
        res.status(500).json({ error: error.message });
    }
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running at http://0.0.0.0:${port}`);
});
