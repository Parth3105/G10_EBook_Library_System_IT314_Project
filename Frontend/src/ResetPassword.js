import React from "react";
import "./ResetPassword.css";
import fliplogo from './images/logo.svg';
import bgimg from './images/bgimage1.png';

function ResetPassword() {
  return (
    <div className="reset-page">
      <div className="left-section">
        <img src={bgimg} alt="Tablet" className="tablet-image" />
      </div>
      <div className="right-section">
        <div className="logo">
          <img src={fliplogo} alt="Logo" />
        </div>
        <h2>Reset Password</h2>
        <form className="reset-form">
          <input type="password" placeholder="New Password" />
          <input type="password" placeholder="Confirm New Password" />
          <button type="submit" className="reset-btn">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
