import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

(async () => {
  try {
    const res = await k8sApi.listPodForAllNamespaces();
    console.log('Raw response:', res); // ✅ Print the whole thing
  } catch (err) {
    console.error('❌ ERROR fetching pods:', err.message);
    console.error('STACK TRACE:\n', err.stack);
  }
})();
