import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import Webcam from "react-webcam"; // Install: npm install react-webcam
import capturePhotostyles from "../styles/CapturePhotoPage.module.css";

const CapturePhotoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Unknown";
  const roll = params.get("roll") || "000000";
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  // Capture Photo
  const capturePhoto = () => {
    const photo = webcamRef.current.getScreenshot();
    setImage(photo);
  };

  // Retake Photo
  const retakePhoto = () => {
    setImage(null);
  };

  // Confirm and Upload Photo
//   const confirmPhoto = async () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("roll", roll);
//     formData.append("image", dataURItoBlob(image));

//     try {
//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       alert(data.message);
//       navigate("/login"); // Redirect to login after successful upload
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

const confirmPhoto = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("roll", roll);
    formData.append("image", dataURItoBlob(image));
  
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Server response:", data); // Debugging log
  
      if (response.ok) {
        alert(data.message);
        setTimeout(() => {
          navigate("/login"); // Delayed redirection
        }, 1000);
      } else {
        alert("Upload failed! Try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  // Convert Base64 to Blob
  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className={capturePhotostyles.captureContainer}>
    <h1>Set up Face ID</h1>
      <h2>Center your face below</h2>
      <div className={capturePhotostyles.cameraBox}>
        {!image ? <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className={capturePhotostyles.webcam} /> : <img src={image} alt="Captured" />}
      </div>
      {!image ? (
        <button className={capturePhotostyles.captureBtn} onClick={capturePhoto}>Take Photo</button>
      ) : (
        <div className={capturePhotostyles.buttonContainer}>
          <button className={capturePhotostyles.confirmBtn} onClick={confirmPhoto}>Confirm</button>
          <button className={capturePhotostyles.retakeBtn} onClick={retakePhoto}>Retake Photo</button>
        </div>
      )}
    </div>
  );
};

export default CapturePhotoPage;
