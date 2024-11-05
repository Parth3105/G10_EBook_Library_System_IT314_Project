import React from 'react';
import './LoginPage.css';
import fliplogo from './images/logo.svg'
import bgimg from './images/bgimage1.png'


function LoginPage() {
  return (
    <div className="login-page">
      <div className="left-section">
        <img src={bgimg} alt="Tablet" className="tablet-image" />
      </div>
      <div className="right-section">
      <div className="logo">
        <img src={fliplogo} alt="Logo" />
        </div>
        <h2>Log in to your Account</h2>
        <form className="login-form">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="register-btn">Log In</button>
        </form>
        <div className="additional-options">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <button className="google-login">
        Continue with Google</button>
        
        <p className="register-link">
          Not Registered Yet? <a href="/register">Register Now</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
