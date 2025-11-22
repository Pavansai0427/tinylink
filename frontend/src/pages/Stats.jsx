import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Stats() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/links/${code}`);
        setData(res.data);
      } catch (err) {
        setData({ error: "Not found" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  if (loading) return <div className="empty">Loading...</div>;
  if (!data || data.error) return <div className="empty">Link not found</div>;

  return (
    <div>
      <h2 className="page-title">Stats for <span style={{ color: '#2b6ef6' }}>{code}</span></h2>

      <div className="form-box">
        <div style={{ width: '100%' }}>
          <p><strong>Target URL:</strong> <a href={data.url} target="_blank" rel="noreferrer">{data.url}</a></p>
          <p><strong>Total Clicks:</strong> {data.clicks ?? 0}</p>
          <p><strong>Created At:</strong> {new Date(data.created_at).toLocaleString()}</p>
          <p><strong>Last Clicked:</strong> {data.last_clicked ? new Date(data.last_clicked).toLocaleString() : "Never"}</p>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/" className="nav-link">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
