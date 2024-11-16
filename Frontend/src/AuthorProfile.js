import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import mainlogo from "./images/logo.png";
import Homeicon from "./images/homeicon.png";
import Likeicon from "./images/wishlisticon.png";
import Usericon from "./images/profileicon.png";
import "./AuthorProfile.css";
import axios from 'axios';

function AuthorProfile() {
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
  return (
    <div className="author-profile-container">
      <header className="author-header">
        <div className="logo-icon">
          <img src={mainlogo} alt="FlipThePage" className="logo" />
        </div>
        <div className="actions">
          <Link to="/author" className="home">
            <img src={Homeicon} alt="home" />
          </Link>
          <Link to="/wishlist" className="wishlist">
            <img src={Likeicon} alt="whishlist" />
          </Link>
          <Link to="/author-profile" className="author-profile">
            <img src={Usericon} alt="profile-photo" />
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
