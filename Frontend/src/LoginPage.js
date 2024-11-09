import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import fliplogo from './images/logo.svg';
import bgimg from './images/bgimage1.png';

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
          Continue with Google
        </button>

        {/* Replaced anchor tag with Link component */}
        <p className="register-link">
          Not Registered Yet? <Link to="/Register">Register Now</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
