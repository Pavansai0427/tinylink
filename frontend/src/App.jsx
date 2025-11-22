import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Health from "./pages/Health";

export default function App() {
  return (
    <BrowserRouter>
      <div className="site">
        <header className="site-header">
          <div className="header-inner">
            <img className="logo" src="/mnt/data/4a1476cd-f3ce-43af-a7a1-7c2f399f2d43.png" alt="TinyLink" />
            <nav className="nav">
              <Link className="nav-link" to="/">Dashboard</Link>
              <Link className="nav-link" to="/health">Health</Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<Stats />} />
            <Route path="/health" element={<Health />} />
          </Routes>
        </main>

        <footer className="site-footer">
          © {new Date().getFullYear()} TinyLink
        </footer>
      </div>
    </BrowserRouter>
  );
}
