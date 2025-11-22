import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Health() {
  const [info, setInfo] = useState(null);
  const [uptime, setUptime] = useState(null);

  useEffect(() => {
    let serverStart = null;
    const load = async () => {
      try {
        const res = await axios.get("/healthz");
        setInfo(res.data);
        
        if (res.data && res.data.server_time) {
          serverStart = new Date(res.data.server_time);
          setUptime(msToHuman(Date.now() - serverStart.getTime()));
        } else if (res.data && res.data.started_at) {
          setUptime(msToHuman(Date.now() - new Date(res.data.started_at).getTime()));
        } else {
          
          setUptime("Uptime not provided by server");
        }
      } catch (err) {
        setInfo({ error: "Healthcheck failed" });
      }
    };
    load();
  }, []);

  function msToHuman(ms) {
    if (!ms || isNaN(ms)) return "n/a";
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  }

  return (
    <div>
      <h2 className="page-title">Health Check</h2>
      <div className="form-box">
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(info, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Uptime:</strong> {uptime || "—"}
      </div>
    </div>
  );
}
