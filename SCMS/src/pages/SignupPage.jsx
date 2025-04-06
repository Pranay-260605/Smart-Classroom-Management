import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import signupStyles from "../styles/SignupPage.module.css";
import signupLogo from "../assets/Logo_Black.png";

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get("user") || "student";
  const [formData, setFormData] = useState({
    name: "",
    // lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Send form data to backend
    navigate(`/capture-photo?name=${formData.name}&roll=${formData.idNumber}`);

  };

  return (
  <main>
    <img src={signupLogo} alt="NexLearn Logo" className={signupStyles.signupLogo} />
    <div className={signupStyles.signupContainer}>
      <div className={signupStyles.signupBox}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Name*</label>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />

          {/* <label>Last Name*</label>
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required /> */}

          <label>{userType === "student" ? "Roll No*" : "Employee ID*"}</label>
          <input type="text" name="idNumber" placeholder={userType === "student" ? "Roll No" : "Employee ID"} value={formData.idNumber} onChange={handleInputChange} required />

          <label>Email ID*</label>
          <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} required />

          <label>Phone Number*</label>
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />

          <label>Set Password*</label>
          <input type="password" name="password" placeholder="Set Password" value={formData.password} onChange={handleInputChange} required />

          <label>Confirm Password*</label>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />

          <button type="submit" className={signupStyles.continueBtn}>Continue</button>
        </form>
      </div>
      <div className={signupStyles.footerLinks}>
        <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
      </div>
    </div>
    </main>
  );
};

export default SignUpPage;
