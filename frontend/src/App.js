import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pods from backend
    fetch("/pods")
      .then((res) => res.json())
      .then((data) => {
        setPods(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch pods:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>KubeVisualizer</h1>
        {loading ? (
          <p>Loading pods...</p>
        ) : (
          <>
            <h2>📦 Pods List</h2>
            <ul>
              {pods.map((pod, index) => (
                <li key={index}>
                  <strong>{pod.metadata.name}</strong> —{" "}
                  {pod.status.phase}
                </li>
              ))}
            </ul>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
