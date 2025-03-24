import React from "react";
import { useNavigate } from "react-router-dom";
import homelogo from "../assets/Logo_White.png";
import homeStyles from "../styles/home.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={homeStyles.homeContainer}>
      {/* Logo */}
      <img src={homelogo} alt="Nexlearn Logo" className={homeStyles.homelogo} />

      {/* Buttons */}
      <div className={homeStyles.buttonContainer}>
        <button 
          className={homeStyles.studentButton} 
          onClick={() => navigate("/login?user=student")}>
            Login as Student
        </button>
        <button 
          className={homeStyles.teacherButton} 
          onClick={() => navigate("/login?user=faculty")}>
            Login as Teacher
        </button>
      </div>
    </div>
  );
};

export default HomePage;
