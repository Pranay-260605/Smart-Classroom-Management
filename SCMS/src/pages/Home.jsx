import React from "react";
import homelogo from "../assets/Logo_White.png";
import homeStyles from "../styles/home.module.css";

const HomePage = () => {
  return (
    <div className={homeStyles.homeContainer}>
      {/* Logo */}
      <img src={homelogo} alt="Nexlearn Logo" className={homeStyles.homelogo} />

      {/* Buttons */}
      <div className={homeStyles.buttonContainer}>
        <button className={homeStyles.studentButton}>Login as Student</button>
        <button className={homeStyles.teacherButton}>Login as Teacher</button>
      </div>
    </div>
  );
};

export default HomePage;
