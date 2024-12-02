import React, { useState,useEffect } from "react";
import "./EmailVerification.css";
import fliplogo from "./images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import axios from "axios";
//import bgimg from './images/bgimage1.png';

const BACKEND_URL = "http://localhost:5000";

function EmailVerification() {

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
                clearInterval(timer);
                setIsVisible(true); // Show resend link after countdown ends
                return 0;
            }
            return prevTime - 1;
        });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
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
    e.preventDefault();

    await axios
      .post(`${BACKEND_URL}/verifyOTP`, {
        username: prevState.username,
        password: prevState.password,
        email: prevState.email,
        userRole: prevState.userRole,
        verified: false,
        otp: code,
      })
      .then((result) => {
        if(result.data.code === 101){
          alert(result.data.msg);
        }
        else if(result.data.code === 102){
          alert(result.data.msg);
        }
        else if(result.data.code === 200){
          alert(result.data.msg);
          // If validation passes, navigate to EmailVerification page
          navigate("/LoginPage");
        }
        else if(result.data.code === 500){
          alert(result.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const handleResend = async (e) => {
    setIsResendDisabled(true);

    setIsVisible(false); // Hide again after click
    setTimeLeft(30); // Reset timer to 30

    // Restart the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsVisible(true);
          return 0;
        }
      return prevTime - 1;
      });
    }, 1000);

    e.preventDefault();

    try {
      // Make a POST request to your backend endpoint to resend the OTP
      await axios.post(`${BACKEND_URL}/resendOTP`, prevState);

      // Update the message to notify the user of successful resend
      setMessage("A new code has been sent to your email.");
    } catch (error) {
      // Update the message to notify the user in case of an error
      setMessage("Failed to send code. Please try again.");
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
          {isVisible ? (
                    <span onClick={handleResend} className="resend-link">
                        Resend code
                    </span>
                ) : (
                    <span className="resend-countdown">
                        Please wait {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)} to resend.
                    </span>
                )}
        </p>
        {message && <p className="verification-message">{message}</p>}
      </div>
    </div>
  );
}

export default EmailVerification;
