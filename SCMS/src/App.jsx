import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import CapturePhotoPage from "./pages/CapturePhotoPage";
import Knowlio from "./pages/Knowlio";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/capture-photo" element={<CapturePhotoPage />} />
        <Route path="/knowlio" element={<Knowlio />} />

      </Routes>
    </Router>
  );
}

export default App;
