CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    clicks INT DEFAULT 0,
    last_clicked TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
