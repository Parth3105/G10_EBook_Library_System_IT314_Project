import React from "react";
import { Link } from "react-router-dom";
import mainlogo from "./images/logo.png";
import Homeicon from "./images/homeicon.png";
import Likeicon from "./images/wishlisticon.png";
import Usericon from "./images/profileicon.png";
import "./AuthorReadingHistory.css";

function AuthorReadingHistory() {
  return (
    <div className="author-profile-container">
      <header className="header">
        <div className="logo-icon">
          <img src={mainlogo} alt="FlipThePage" className="logo" />
        </div>
        <div className="actions">
          <Link to="/home" className="home">
            <img src={Homeicon} alt="home" />
          </Link>
          <Link to="/Wishlist" className="whishlist">
            <img src={Likeicon} alt="whishlist" />
          </Link>
          <Link to="/author-profile" className="author-profile">
            <img src={Usericon} alt="profile-photo" />
          </Link>
        </div>
      </header>
      <nav className="navigation">
        <div className="text-1">
          <Link to="/author-profile">My Profile</Link>
        </div>
        <div className="text-2">
          <Link to="/author-upload">My Uploads</Link>
        </div>
        <div className="text-3 active">
          <Link to="/author-reading">Reading History</Link>
        </div>
      </nav>

      <div className="author-content">
        <section className="curr-reading">
          <h1>Currently Reading</h1>
          <p>The books that you are currently reading will appear here.</p>
        </section>
      </div>
    </div>
  );
}

export default AuthorReadingHistory;
