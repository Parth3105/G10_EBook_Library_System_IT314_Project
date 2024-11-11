import React, { useState } from 'react';
import './EmailVerification.css';
import fliplogo from './images/logo.png';
import bgimg from './images/bgimage1.png';

function EmailVerification() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = () => {
    if (code === '1234') { // Replace '1234' with actual code verification logic
      setMessage('Verification successful!');
    } else {
      setMessage('Invalid code. Please try again.');
    }
  };

  const handleResend = () => {
    setIsResendDisabled(true);
    setMessage('A new code has been sent to your email.');

    // Enable the button again after 60 seconds
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 60000); // 60 seconds
  };

  return (
    <div className="verification-page">
      {/* Left Section */}
      <div className="verification-left">
          
      </div>
      {/* Right Section */}
      <div className="verification-right">
      <div className="logo">
        <img src={fliplogo} alt="Logo" />
        </div>
        <h1 className="verification-title">Verify your email</h1>
        <div className='Verification-description'>
            <p className="verification-text">We've sent a 4-digit verifiction code to your email.</p>
            <p className="verification-text">please check your inbox and enter the code below.</p>
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
        <button onClick={handleVerify} className="verification-button">Verify</button>
        
        <p className="resend-text">
          Didn’t receive the code? <span onClick={handleResend} className="resend-link">Resend code</span>
        </p>
        {message && <p className="verification-message">{message}</p>}
      </div>
    </div>
  );
}

export default EmailVerification;
