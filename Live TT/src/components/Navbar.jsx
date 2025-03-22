import React from "react";
import Logo from "./Logo_White.png";

export default function Navbar() {
  return (
    <nav className="relative w-full p-5">
      <img src={Logo} alt="NEXLEARN Logo" className="logo" />
    </nav>
  );
}
