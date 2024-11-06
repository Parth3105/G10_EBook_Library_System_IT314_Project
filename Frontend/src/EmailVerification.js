import React, { useState } from 'react';
import './EmailVerification.css';

function EmailVerification() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = () => {
    if (code === '1234') { // Replace '1234' with the actual code verification logic
      setMessage('Verification successful!');
    } else {
      setMessage('Invalid code. Please try again.');
    }
  };

  const handleResend = () => {
    setIsResendDisabled(true);
    setMessage('A new code has been sent to your email.');
    
    // Simulate the code resend and enable the button after 60 seconds
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 60000); // 60 seconds
  };

  return (
    <div className="verification-container">
      <h2 className="verification-title">Email Verification</h2>
      <p className="verification-text">Please enter the 4-digit code sent to your email.</p>
      <input
        type="text"
        maxLength="4"
        value={code}
        onChange={handleChange}
        className="verification-input"
        placeholder="1234"
      />
      <button onClick={handleVerify} className="verification-button">Verify</button>
      <button
        onClick={handleResend}
        className="verification-button"
        disabled={isResendDisabled}
      >
        Resend Code
      </button>
      {message && <p className="verification-message">{message}</p>}
    </div>
  );
}

export default EmailVerification;
