import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // ✅ Kubernetes internal DNS service name (works inside the cluster)

  // const API_BASE_URL = "http://backend-service:5000";

  // const API_BASE_URL = "http://localhost:5000";
  const API_BASE_URL = "http://192.168.49.2:31921";




  const fetchPods = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/pods`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setPods(data.items || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch pods:", err);
        setError("❌ Failed to fetch pods. Make sure backend-service is reachable.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPods();
    const interval = setInterval(() => {
      setRefreshCount((prev) => prev + 1);
      fetchPods();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 KubeVisualizer Dashboard</h1>
        <button className="refresh-btn" onClick={fetchPods}>
          🔁 Manual Refresh
        </button>

        {loading && <p>⏳ Loading pods...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <h2>📦 Pods List ({pods.length} total)</h2>
            <div className="pod-grid">
              {pods.map((pod, index) => (
                <div key={index} className="pod-card">
                  <h3>{pod.metadata.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        pod.status.phase === "Running"
                          ? "status-running"
                          : "status-error"
                      }
                    >
                      {pod.status.phase}
                    </span>
                  </p>
                  <p>
                    <strong>Namespace:</strong> {pod.metadata.namespace}
                  </p>
                  <p>
                    <strong>Node:</strong> {pod.spec.nodeName || "N/A"}
                  </p>
                  <p>
                    <strong>Start Time:</strong>{" "}
                    {new Date(pod.status.startTime).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
