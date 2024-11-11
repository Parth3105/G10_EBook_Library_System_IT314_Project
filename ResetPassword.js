import React from "react";
import "./ResetPassword.css";
import logo from "./images/logo.png";
import tablet from "./images/bgimage1.png";

function ResetPassword() {
  return (
    <div className="reset-password-container">
      <div className="background">
        <div className="book-covers"></div>
      </div>
      <div className="tablet-image">
        <img src={tablet} alt="Tablet" />
      </div>
      <div className="reset-password-box">
        <div className="logo">
          <img src={logo} alt="FlipThePage Logo" />
        </div>
        <h2>Reset Password</h2>
        <form>
          <label>New password</label>
          <input type="password" placeholder="Type in your new password" />
          <label>Confirm new password</label>
          <input type="password" placeholder="Confirm the new password" />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
