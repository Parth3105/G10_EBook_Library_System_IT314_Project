import React from 'react';
import './RegisterPage.css';
import { Link, useLocation } from 'react-router-dom';  // Import useLocation hook
import fliplogo from './images/logo.png';

function RegisterPage() {
  // Retrieve the passed role from the location state
  const location = useLocation();
  const { role } = location.state || {};  // Destructure the role from state

  return (
    <div className="register-page">
      <div className="left-section">
        {/* You can add content here for the left section */}
      </div>
      <div className="right-section">
        <div className="logo1">
          <img src={fliplogo} alt="Logo" />
        </div>

        <h2 className="register-heading">Register Your Account</h2>

        {/* Display the selected role */}
        {role && <p className="role-info">You are registering as: {role}</p>} 

        <form className="register-form">
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="E-mail" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

          <button type="submit" className="register-btn">Register</button>
        </form>

        <p className="login-link">
          Already Registered? <Link to="/login" className='Login-Page'>Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
