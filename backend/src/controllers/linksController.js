import { pool } from "../db.js";


function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export const getAllLinks = async (req, res) => {
  try {
    const q = "SELECT * FROM links ORDER BY created_at DESC";
    const result = await pool.query(q);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load links" });
  }
};

export const getOneLink = async (req, res) => {
  const { code } = req.params;
  try {
    const q = "SELECT * FROM links WHERE code=$1";
    const result = await pool.query(q, [code]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed" });
  }
};

export const createLink = async (req, res) => {
  const { url, code } = req.body;

  if (!url || !isValidUrl(url))
    return res.status(400).json({ error: "Invalid URL" });

  let short = code;

  
  if (!short) {
    short = Math.random().toString(36).substring(2, 10);
  }

  
  if (!/^[A-Za-z0-9]{6,10}$/.test(short)) {
    return res.status(400).json({ error: "Code must be alphanumeric (6-10 chars)" });
  }

  try {
    const exists = await pool.query("SELECT code FROM links WHERE code=$1", [short]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: "Code already exists" });

    const q = "INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(q, [short, url]);

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create link" });
  }
};

export const deleteLink = async (req, res) => {
  const { code } = req.params;
  try {
    await pool.query("DELETE FROM links WHERE code=$1", [code]);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
};


export const redirectCode = async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query("SELECT * FROM links WHERE code=$1", [code]);

    if (result.rows.length === 0) {
      return res.status(404).send("Not Found");
    }

    const link = result.rows[0];

    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
      [code]
    );

    return res.redirect(302, link.url);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed");
  }
};


export const healthCheck = (req, res) => {
  res.json({
    ok: true,
    version: "1.0",
    uptime: process.uptime(),
  });
};
