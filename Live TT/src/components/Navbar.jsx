import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">College Timetable</h1>
        <div>
          <Link className="mr-4" to="/">Home</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
