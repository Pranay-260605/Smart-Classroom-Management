// import React, { useState } from "react";
// import signupStyles from "../styles/SignupPage.module.css"

// const SignUpPage = () => {
//   const [userType, setUserType] = useState("student");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     idNumber: "", // Employee ID or Roll No
//   });

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className={signupStyles.signupContainer}>
//       {/* Tab Switcher */}
//       <div className={signupStyles.tabSwitcher}>
//       <button
//         className={`${signupStyles.tabButton} ${userType === "student" ? signupStyles.activeTab : ""}`}
//         onClick={() => setUserType("student")}
//       >
//         Student
//       </button>
//       <button
//         className={`${signupStyles.tabButton} ${userType === "faculty" ? signupStyles.activeTab : ""}`}
//         onClick={() => setUserType("faculty")}
//       >
//         Faculty
//       </button>

//       </div>

//       {/* Form */}
//       <form className={signupStyles.signupForm}>
//         <input
//           type="text"
//           name="firstName"
//           placeholder="First Name"
//           value={formData.firstName}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="text"
//           name="lastName"
//           placeholder="Last Name"
//           value={formData.lastName}
//           onChange={handleInputChange}
//           required
//         />

//         {/* Dynamic Field */}
//         <input
//           type="text"
//           name="idNumber"
//           placeholder={userType === "student" ? "Roll No" : "Employee ID"}
//           value={formData.idNumber}
//           onChange={handleInputChange}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email ID"
//           value={formData.email}
//           onChange={handleInputChange}
//           className={signupStyles.inputField}
//           required
//         />
//         <input
//           type="tel"
//           name="phone"
//           placeholder="Phone Number"
//           value={formData.phone}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Set Password"
//           value={formData.password}
//           onChange={handleInputChange}
//           required
//         />
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleInputChange}
//           required
//         />

//         <button type="submit" className={signupStyles.signupButton}>Sign Up</button>
//         <button type="button" className={signupStyles.faceIdButton}>Setup Face ID</button>
//       </form>

//       {/* Footer */}
//       <div className={signupStyles.termsContainer}>
//         <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
