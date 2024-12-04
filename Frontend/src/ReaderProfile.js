import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReaderProfile.css';
import logo from './images/logo.png';
import homeicon from './images/homeicon.png';
import wishlisticon from './images/wishlisticon.png';
import profileicon from './images/profileicon.png';
import axios from 'axios';

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

function ReaderProfile() {
  const navigate = useNavigate();
  const [activeicon, setActiveicon] = useState("profile");
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    userRole: '',
  });

  const handleIconClick = (icon) => {
    setActiveicon(icon);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('USERNAME');

    axios.get(`${BACKEND_URL}/myProfile/${storedUsername}`)
      .then(response => {
        if (response.data.code === 100) {
          const { username: username, email: email, userRole: userRole } = response.data.user;
          setUserData({ username, email, userRole });
        }
      })
  })

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="reader-profile-page">
      <ToastContainer />
      <header className="reader-header">
        <div className="flip-the-page">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="nav-icons">
          <Link to="/reader" onClick={() => handleIconClick("home")}>
            <img
              src={homeicon}
              alt="Home"
              className={`homeicon ${activeicon === "home" ? "" : ""}`}
            />
          </Link>
          <Link to="/Wishlist" onClick={() => handleIconClick("wishlist")}>
            <img
              src={wishlisticon}
              alt="Wishlist"
              className={`wishlisticon ${activeicon === "wishlist" ? "" : ""}`}
            />
          </Link>
          <Link to="/reader-profile" onClick={() => handleIconClick("profile")}>
            <img
              src={profileicon}
              alt="Profile"
              className={`profileicon ${activeicon === "profile" ? "" : ""}`}
            />
          </Link>
        </div>
      </header>
      <nav className="navbar">
        <div className="item1 active">
          <Link to="/reader-profile">My Profile</Link>
        </div>
        <div className="item2">
          <Link to="/reading-history">Reading History</Link>
        </div>

      </nav>
      <div className="reader-content">
        <section className="details-section">
          <h1>Details</h1>
          <div className="details">
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value={userData.username} readOnly />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={userData.email} readOnly />
            </div>
            <div className="input-group">
              <label>Role</label>
              <input type="text" name="role" value={userData.userRole} readOnly />
            </div>
          </div>
          {/* <div className="reader-user-input">
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value="johnmurphy" readOnly/>
            </div>
          </div> */}
        </section>
        <div className="item3">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReaderProfile;
