import React from "react";
import { Link } from "react-router-dom";
import mainlogo from "./images/logo.png";
import Homeicon from "./images/homeicon.png";
import Likeicon from "./images/wishlisticon.png";
import Usericon from "./images/profileicon.png";
import "./AuthorProfile.css";

function AuthorProfile() {
  return (
    <div className="author-profile-container">
      <header className="author-header">
        <div className="logo-icon">
          <img src={mainlogo} alt="FlipThePage" className="logo" />
        </div>
        <div className="actions">
          <Link to="/home" className="home">
            <img src={Homeicon} alt="home" />
          </Link>
          <Link to="/whishlist" className="whishlist">
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">Firstname</label>
              <input type="text" id="firstname" name="firstname" value="jhondunphy" reeadonly/>
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Lastname</label>
              <input type="text" id="lastname" name="lastname" value="jhondunphy" reeadonly/>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input type="text" id="role" name="role" value="jhondunphy" reeadonly/>
            </div>
          </div>
          <div className="user-input">
            <div className="form-group">
              <label htmlFor="Username">Username</label>
              <input type="text" id="Username" name="Username" value="jhondunphy" reeadonly/>
            </div>
          </div>
        </section>

        <section className="rented-books">
          <h1>Rented Books</h1>
          <p>No books rented yet.</p>
        </section>

        <section className="purchased-books">
          <h1>Purchased Books</h1>
          <p>No books purchased yet.</p>
        </section>
      </div>
    </div>
  );
}

export default AuthorProfile;
