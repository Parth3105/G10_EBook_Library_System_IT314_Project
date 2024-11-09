import React from 'react';
import './RegisterPage.css';
import { Link } from 'react-router-dom';
import fliplogo from './images/logo.png';

function RegisterPage() {
  return (
    <div className="register-page">
      <div className="left-section">
        
      </div>
      <div className="right-section">
      <div className="logo1">
        <img src={fliplogo} alt="Logo" />
        </div>
        
        <h2 class="register-heading">Register Your Account</h2>

        <form className="register-form">
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="E-mail"/>
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          
          <button type="submit" className="register-btn">Register</button>
        </form>
        
        <p className="login-link">
          Already Registered? <Link to="/Login" className='Login-Page'>Log In</Link>
        </p>
        
      </div>
    </div>
  );
}

export default RegisterPage;
