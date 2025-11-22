import React, { useEffect, useState } from "react";
import axios from "axios";
import LinkForm from "../components/LinkForm";
import LinkRow from "../components/LinkRow";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filterResult, setFilterResult] = useState([]);


  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/links");

      
      const result = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.links)
        ? res.data.links
        : [];

      setLinks(result);
      setFilterResult(result);
    } catch (err) {
      console.error("LOAD LINKS ERROR:", err);
      setLinks([]);
      setFilterResult([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);


  useEffect(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      setFilterResult(links);
      return;
    }

    const safe = Array.isArray(links) ? links : [];

    const filtered = safe.filter((l) =>
      (l.code || "").toLowerCase().includes(term) ||
      (l.url || "").toLowerCase().includes(term)
    );

    setFilterResult(filtered);
  }, [q, links]);


  const createLink = async ({ url, code }) => {
    try {
      const payload = { url };
      if (code) payload.code = code;

      const res = await axios.post("/api/links", payload);

      
      const newLink = res.data.link ?? res.data;

      setLinks((prev) => [newLink, ...prev]);
      setFilterResult((prev) => [newLink, ...prev]);

      return newLink;

    } catch (err) {
      if (err.response?.status === 409) {
        throw new Error("Code already exists. Choose another!");
      }
      throw new Error("Failed to create link.");
    }
  };


  const deleteLink = async (code) => {
    try {
      await axios.delete(`/api/links/${code}`);

      setLinks((prev) => prev.filter((l) => l.code !== code));
      setFilterResult((prev) => prev.filter((l) => l.code !== code));
    } catch (err) {
      alert("Delete failed.");
    }
  };


  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      <LinkForm onCreate={createLink} />

      <div className="search">
        <input
          placeholder="Search by code or URL"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="empty">Loading...</div>
        ) : filterResult.length === 0 ? (
          <div className="empty">No links yet. Create one above!</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>URL</th>
                <th>Clicks</th>
                <th>Last Clicked</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filterResult.map((link) => (
                <LinkRow
                  key={link.code}
                  link={link}
                  onDelete={deleteLink}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
