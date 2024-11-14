import React, { useState } from "react";
import "./EmailVerification.css";
import fliplogo from "./images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import axios from "axios";
//import bgimg from './images/bgimage1.png';

function EmailVerification() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const location = useLocation();
  const prevState = location.state;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = async (e) => {
    // if (code === '1234') { // Replace '1234' with actual code verification logic
    //   setMessage('Verification successful!');
    // } else {
    //   setMessage('Invalid code. Please try again.');
    // }

    e.preventDefault();

    await axios
      .post("http://localhost:5000/verifyOTP", {
        email: prevState.email,
        otp: code,
      })
      .then((result) => {
        console.log("Verified successfully!");
        // If validation passes, navigate to EmailVerification page
        navigate("/LoginPage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleResend = () => {
  //   setIsResendDisabled(true);
  //   setMessage("A new code has been sent to your email.");

  //   // Enable the button again after 60 seconds
  //   setTimeout(() => {
  //     setIsResendDisabled(false);
  //   }, 60000); // 60 seconds
  // };

  const handleResend = async () => {
    setIsResendDisabled(true);
    setMessage("Sending a new code to your email...");

    try {
      // Make a POST request to your backend endpoint to resend the OTP
      await axios.post("http://localhost:5000/resendOTP", {
        email: prevState.email,
        otp: code,
      });

      // Update the message to notify the user of successful resend
      setMessage("A new code has been sent to your email.");
    } catch (error) {
      // Update the message to notify the user in case of an error
      setMessage("Failed to send code. Please try again.");
      console.error("Error resending OTP:", error);
    }

    // Enable the button again after 60 seconds
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 60000); // 60 seconds
  };

  return (
    <div className="verification-page">
      {/* Left Section */}
      <div className="verification-left"></div>
      {/* Right Section */}
      <div className="verification-right">
        <div className="logo">
          <img src={fliplogo} alt="Logo" />
        </div>
        <h1 className="verification-title">Verify your email</h1>
        <div className="Verification-description">
          <p className="verification-text">
            We've sent a 4-digit verification code to your email.
          </p>
          <p className="verification-text">
            please check your inbox and enter the code below.
          </p>
        </div>
        <p className="veri-text">Enter the 4-digit code</p>
        <input
          type="text"
          maxLength="4"
          value={code}
          onChange={handleChange}
          className="verification-input"
          placeholder="_ _ _ _"
        />
        <button onClick={handleVerify} className="verification-button">
          Verify
        </button>

        <p className="resend-text">
          Didn’t receive the code?{" "}
          <span onClick={handleResend} className="resend-link">
            Resend code
          </span>
        </p>
        {message && <p className="verification-message">{message}</p>}
      </div>
    </div>
  );
}

export default EmailVerification;
