import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin.jsx";
import Home from "../pages/Home.jsx";
import Logo from "./Logo_White.png";
import '../index.css';

export default function App() {
  return (
    <Router>
      {/* Fixed position logo */}
      <div className="fixed top-4 left-4 z-50">
        <img src={Logo} alt="NEXLEARN Logo" className="h-10 w-auto" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}
