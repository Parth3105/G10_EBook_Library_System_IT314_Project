import React, { useState } from "react";
import "./ForgotPassword.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import fliplogo from "./images/logo.svg";
import bgimg from "./images/bgimage1.png";
import axios from "axios";

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSendResetLink = (e) => {
    e.preventDefault();
    axios
      .post(`${BACKEND_URL}/forgotPassword`, {
        email: email,
      })
      .then((res) => {
        if (res.data.code === 501) {
          alert(res.data.msg);
        }
        else if (res.data.code === 502) {
          alert(res.data.msg);
        }
        else if (res.data.code === 503) {
          alert(res.data.msg);
        }
        else {
          setShowOtpModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // Show the OTP modal on button click
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    axios.post(`${BACKEND_URL}/resetPass/verifyOTP`, { email: email, otp: otp })
      .then((res) => {
        if (res.data.code === 600) {
          navigate("/reset-password", { state: { email: email } }); // Navigate to ResetPassword page upon OTP submission
        }
        else {
          alert(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="forgot-password-page">
      <div className="left-section">
        <img src={bgimg} alt="Tablet" className="tablet-image" />
      </div>
      <div className="right-section">
        <div className="logo">
          <img src={fliplogo} alt="Logo" />
        </div>
        <h2>Reset Your Password</h2>
        <p>Enter your email to receive a password reset OTP.</p>
        <form className="forgot-password-form" onSubmit={handleSendResetLink}>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email"
            required />
          <button type="submit" className="reset-btn">
            Send OTP
          </button>
        </form>
        <div className="additional-options">
          <Link to="/LoginPage">Back to Login</Link>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Enter the OTP</h3>
            <p>Enter the 4-digit code</p>
            <form onSubmit={handleOtpSubmit}>
              <input
                onChange={(e) => {
                  setOTP(e.target.value);
                }}
                type="text"
                maxLength="4"
                placeholder="••••"
                required />
              <button type="submit" className="enter-btn">
                Enter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
