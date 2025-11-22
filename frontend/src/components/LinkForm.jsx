import React, { useState } from "react";

export default function LinkForm({ onCreate }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) { setError("Please enter a URL"); return; }

    setLoading(true);
    try {
      await onCreate({ url: url.trim(), code: code.trim() || undefined });
      setUrl(""); setCode("");
    } catch (err) {
      setError(err.message || "Error creating link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <input className="input-url" placeholder="Enter URL" value={url} onChange={(e)=>setUrl(e.target.value)} />
      <input className="input-code" placeholder="Custom code (optional)" value={code} onChange={(e)=>setCode(e.target.value)} />
      <button className="btn-create" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Link"}
      </button>
      {error && <div style={{ color: "red", marginLeft: 8 }}>{error}</div>}
    </form>
  );
}
