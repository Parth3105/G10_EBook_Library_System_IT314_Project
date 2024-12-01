import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import homeIcon from "./images/homeicon.png";
import wishlistIcon from "./images/wishlisticon.png";
import profileIcon from "./images/profileicon.png";
import logo from "./images/logo.png";
import "./AuthorProfile.css";
import axios from 'axios';

function AuthorProfile() {
  const [activeIcon, setActiveIcon] = useState("profile");
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    userRole: '',
  });

  useEffect(()=>{
    const storedUsername = localStorage.getItem('USERNAME');

    axios.get(`http://localhost:5000/myProfile/${storedUsername}`)
    .then(response => {
      if(response.data.code===100){
        const { username: username, email: email, userRole: userRole } = response.data.user;
        setUserData({ username, email, userRole });
      }
  })
  })
  const handleIconClick = (icon) => {
    setActiveIcon(icon);
  };

  return (
    <div className="author-profile-container">
      <header className="header">
        <div className="flip-the-page">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="nav-icons">
          <Link to="/author" onClick={() => handleIconClick("home")}>
            <img
              src={homeIcon}
              alt="Home"
              className={`homeicon ${activeIcon === "home" ? "" : ""}`}
            />
          </Link>
          <Link to="/wishlist" onClick={() => handleIconClick("wishlist")}>
            <img
              src={wishlistIcon}
              alt="Wishlist"
              className={`wishlisticon ${activeIcon === "wishlist" ? "" : ""}`}
            />
          </Link>
          <Link to="/author-profile" onClick={() => handleIconClick("profile")}>
            <img
              src={profileIcon}
              alt="Profile"
              className={`profileicon ${activeIcon === "profile" ? "" : ""}`}
            />
          </Link>
        </div>
      </header>
      <nav className="navigation">
        <div className="text-1 active">
          <Link to="/author-profile">My Profile</Link>
        </div>
        <div className="text-2">
          <Link to="/author-upload">My Uploads</Link>
        </div>
        <div className="text-3">
          <Link to="/author-reading">Reading History</Link>
        </div>
      </nav>

      <div className="author-content">
        <section className="profile-details">
        <h1>Details</h1>
          <div className="details">
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value={userData.username} readOnly/>
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={userData.email} readOnly/>
            </div>
            <div className="input-group">
              <label>Role</label>
              <input type="text" name="role" value={userData.userRole} readOnly/>
            </div>
          </div>
          {/* <div className="reader-user-input">
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value="johnmurphy" readOnly/>
            </div>
          </div> */}
        </section>
        {/* <section className="books-section">
          <h1>Rented Books</h1>
          <p>No books rented yet.</p>
        </section>
        <section className="books-section">
          <h1>Purchased Books</h1>
          <p>No books purchased yet.</p>
        </section> */}
      </div>
    </div>
  );
}

export default AuthorProfile;
