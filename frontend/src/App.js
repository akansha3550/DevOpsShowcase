import { useEffect, useState } from "react";
import { FaSyncAlt, FaBox, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "./App.css";

function App() {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // ✅ Call same origin (ingress will handle backend requests)
  const API_BASE_URL = ""; // Use same origin

  const fetchPods = () => {
    setLoading(true);
    fetch(`/api/pods`)
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
        setError("Failed to fetch pods. Backend unreachable.");
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

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Running":
        return <FaCheckCircle className="status-icon running" title="Running" />;
      case "Pending":
        return <FaClock className="status-icon pending" title="Pending" />;
      case "Failed":
        return <FaTimesCircle className="status-icon failed" title="Failed" />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <span role="img" aria-label="rocket">
            🚀
          </span>{" "}
          KubeVisualizer Dashboard
        </h1>
        <button className="refresh-btn" onClick={fetchPods} aria-label="Manual Refresh">
          <FaSyncAlt /> Manual Refresh
        </button>

        {loading && <p>⏳ Loading pods...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <h2>
              <FaBox /> Pods List ({pods.length} total)
            </h2>
            <div className="pod-grid">
              {pods.map((pod, index) => (
                <div key={index} className="pod-card" tabIndex={0} aria-label={`Pod ${pod.metadata.name}`}>
                  <h3>{pod.metadata.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    {renderStatusIcon(pod.status.phase)}{" "}
                    <span
                      className={
                        pod.status.phase === "Running"
                          ? "status-running"
                          : pod.status.phase === "Pending"
                            ? "status-pending"
                            : pod.status.phase === "Failed"
                              ? "status-failed"
                              : "status-unknown"
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
