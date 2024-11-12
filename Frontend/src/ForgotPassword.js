import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import fliplogo from './images/logo.svg';
import bgimg from './images/bgimage1.png';

function ForgotPassword() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSendResetLink = (e) => {
    e.preventDefault();
    setShowOtpModal(true); // Show the OTP modal on button click
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Handle OTP submission logic here
    console.log("OTP entered");
    navigate('/reset-password'); // Navigate to ResetPassword page upon OTP submission
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
        <p>Enter your email to receive a password reset link.</p>
        <form className="forgot-password-form" onSubmit={handleSendResetLink}>
          <input type="email" placeholder="Email" required />
          <button type="submit" className="reset-btn">Send Reset Link</button>
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
              <input type="text" maxLength="4" placeholder="••••" required />
              <button type="submit" className="enter-btn">Enter</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
