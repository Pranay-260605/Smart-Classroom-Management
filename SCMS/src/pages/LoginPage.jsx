import React from "react";
import { Link } from "react-router-dom";
import loginStyles from "../styles/LoginPage.module.css";
import loginLogo from "../assets/Logo_Black.png";

const LoginPage = () => {
  return (
    <div className={loginStyles.loginContainer}>
      <img src={loginLogo} alt="NexLearn Logo" className={loginStyles.loginLogo} />
      
      <div className={loginStyles.loginBox}>
        <h2>Welcome Back</h2>
        
        <label>Email address*</label>
        <input type="email" placeholder="Enter your email" className={loginStyles.inputField} />
        
        <label>Password*</label>
        <input type="password" placeholder="Enter your password" className={loginStyles.inputField} />
        
        <button className={loginStyles.continueBtn}>Continue</button>
        
        <p className={loginStyles.signupText}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
      
      <div className={loginStyles.footerLinks}>
        <Link to="/terms">Terms of Use</Link> | <Link to="/privacy">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default LoginPage;
