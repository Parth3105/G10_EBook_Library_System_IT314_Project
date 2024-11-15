// BookDescription.js
import React, { useState } from 'react';
import './BookDescription.css';
import carticon from './images/carticon.png';
import homeicon from './images/homeicon.png';
import dropdownicon from './images/dropdownicon.png';
import wishlisticon from './images/wishlisticon.png';
import fliplogo from './images/logo.svg';
import searchIcon from './images/searchicon.png';
import profileicon from './images/profileicon.png';
import bookimg from './images/Alchemist.png';
import { Link } from 'react-router-dom';

export default function BookDescription() {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("Add to wishlist");

  const handleWishlist = () => {
    setIsInWishlist(true);
    setWishlistMessage("Added to wishlist");

    // After 3 seconds, revert back to "Add to wishlist"
    setTimeout(() => {
      setIsInWishlist(false);
      setWishlistMessage("Add to wishlist");
    }, 3000);
  };

  const handleReadClick = () => {
    setIsReading(true);
  };

  let author = "(Author)";

  return (
    <div className="book-page">
      {/* Header Section */}
      <header className="author-header">
        <div className="logo-icon">
          <img src={fliplogo} alt="FlipThePage" className="logo" />
        </div>
        <div className="actions">
          <Link to="/home" className="home">
            <img src={homeicon} alt="home" />
          </Link>
          <Link to="/wishlist" className="wishlist">
            <img src={wishlisticon} alt="wishlist" />
          </Link>
          <Link to="/author-profile" className="author-profile">
            <img src={profileicon} alt="profile-photo" />
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="main-content">
        <div className="book-details">
          <img src={bookimg} alt="Book Cover" className="book-cover" />
          <div className="book-info">
            <h2>The Alchemist</h2>
            <p className="authorname">By {author} Paulo Coelho</p>
            <p className="rating">⭐ 5/5</p>
            <p className="price">INR 900.00</p>
            <div className="descriptioncontainer">
              The Alchemist by Paulo Coelho is a philosophical novel that follows Santiago,
              a young Andalusian shepherd, on a journey to find a hidden treasure near the
              Egyptian pyramids. Guided by mysterious omens and encounters with various 
              characters, including a king, an Englishman, and an alchemist, Santiago learns 
              about the value of listening to his heart and pursuing his personal legend. His 
              adventure becomes a quest for self-discovery, emphasizing that true treasure lies within.
            </div>
            <div className="button-group">
              <button onClick={handleReadClick} className="read-button">Read</button>
            </div>
            <div className="wishlist-share">
              <button onClick={handleWishlist} className="wishlist-button">
                <img src={wishlisticon} alt="wishlist icon" className="icon" />
                {wishlistMessage}
              </button>
            </div>
          </div>
        </div>
      </main>
      <div className="border2"></div>
        {/* Other Details Section */}
        <div class="container">
        <div class="left-column">
            <h2 class="title">Other Details</h2>
        </div>
        <div class="right-column">
        <div class="detail">
            <span class="Genre">Genre: </span>
            <span className="typeof">Adventure/Fiction</span>
        </div>
        <div class="detail">
            <span class="language">Language: </span>
            <span className="typeof">English</span>
        </div>
        <div class="detail">
            <span class="Genre">Pages: </span>
            <span className="typeof">208</span>
        </div>
    </div>
    </div>
    </div>
  );
}
