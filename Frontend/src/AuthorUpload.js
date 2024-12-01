import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import homeIcon from "./images/homeicon.png";
import wishlistIcon from "./images/wishlisticon.png";
import profileIcon from "./images/profileicon.png";
import logo from "./images/logo.png";
import "./AuthorUpload.css";
import axios from "axios";

function AuthorUpload() {
  const [activeIcon, setActiveIcon] = useState("profile");
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
        <div className="text-1">
          <Link to="/author-profile">My Profile</Link>
        </div>
        <div className="text-2 active">
          <Link to="/author-upload">My Uploads</Link>
        </div>
        <div className="text-3">
          <Link to="/author-reading">Reading History</Link>
        </div>
      </nav>

      <div className="author-content">
        <section className="upload-books">
          <h1>Uploaded Books</h1>
          <p>No books uploaded yet.</p>
        </section>
      </div>
    </div>
  );
}

export default AuthorUpload;
