import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LinkRow({ link, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      const full = `${window.location.origin}/${link.code}`;
      await navigator.clipboard.writeText(full);
      alert("Copied: " + full);
    } catch {
      alert("Copy failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${link.code}?`)) return;
    setDeleting(true);
    await onDelete(link.code);
    setDeleting(false);
  };

  return (
    <tr>
      <td className="code-cell">{link.code}</td>
      <td className="url-cell" title={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.url}</a></td>
      <td>{link.clicks ?? 0}</td>
      <td>{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "Never"}</td>
      <td>
        <div className="actions">
          <Link to={`/code/${link.code}`} style={{ textDecoration: "none", color: "#0b5394", fontWeight:600 }}>View</Link>
          <button className="btn-copy" onClick={handleCopy}>Copy</button>
          <button className="btn-delete" onClick={handleDelete} disabled={deleting}>{deleting ? "..." : "Delete"}</button>
        </div>
      </td>
    </tr>
  );
}
