import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import linksRouter from "./routes/links.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// simple test route
app.get("/", (req, res) => {
  res.send("TinyLink Backend Running");
});

// healthcheck
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// routes
app.use("/api/links", linksRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
