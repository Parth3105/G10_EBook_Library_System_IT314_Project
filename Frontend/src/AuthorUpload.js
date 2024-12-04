import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "./images/logo.png";
import homeicon from "./images/homeicon.png";
import wishlisticon from "./images/wishlisticon.png";
import profileicon from "./images/profileicon.png";
import removeIcon from './images/removeicon.png';
import "./AuthorUpload.css";
import axios from 'axios';

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

function AuthorUpload() {
  const [activeIcon, setActiveicon] = useState("profile");
  const storedUsername = localStorage.getItem('USERNAME');
  const [books, setBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/getAuthorUploads/${storedUsername}`)
      .then(response => {
        if (response.data.code === 900) {
          setBooks(response.data.books);
        }
      })
  })

  const handleIconClick = (icon) => {
    setActiveicon(icon);
  };

  const handleViewClick = (book) => {
    navigate(`/book/${book._id}`);
  }
  return (
    <div className="author-profile-container">
      <header className="header">
        <div className="flip-the-page">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="nav-icons">
          <Link to="/author" onClick={() => handleIconClick("home")}>
            <img
              src={homeicon}
              alt="Home"
              className={`homeicon ${activeIcon === "home" ? "" : ""}`}
            />
          </Link>
          <Link to="/Wishlist" onClick={() => handleIconClick("wishlist")}>
            <img
              src={wishlisticon}
              alt="Wishlist"
              className={`wishlisticon ${activeIcon === "wishlist" ? "" : ""}`}
            />
          </Link>
          <Link to="/author-profile" onClick={() => handleIconClick("profile")}>
            <img
              src={profileicon}
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

      <div className="author-upload-container">
        <main>
          <h1 className="reader-history-title"></h1>
          <div className="reader-history">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="reader-history-item">
                  <img src={book.coverImage} alt={book.bookTitle} className="book-cover" />
                  <div className="reader-history-details">
                    <h2 className="reader-history-book-title">{book.title}</h2>
                    <p className="reader-history-book-author">{book.author}</p>
                    <button to={`/reading/${book._id}`} onClick={() => handleViewClick(book)} className="reader-history-read-btn">
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="reader-history-empty-message">You have not uploaded any books yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthorUpload;
