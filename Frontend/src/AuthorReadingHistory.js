import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import homeIcon from "./images/homeicon.png";
import wishlistIcon from "./images/wishlisticon.png";
import profileIcon from "./images/profileicon.png";
import removeIcon from "./images/removeicon.png";
import logo from "./images/logo.png";
import "./AuthorReadingHistory.css";
import axios from "axios";

function AuthorReadingHistory() {
  const [activeIcon, setActiveIcon] = useState("profile");
  const storedUsername = localStorage.getItem("USERNAME");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/readHistory/${storedUsername}`)
      .then((response) => {
        if (response.data.code === 200) {
          setBooks(response.data.history);
        }
      });
  });

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
  };
  const handleRemove = (book) => {
    axios.post(`http://localhost:5000/rmHistory`, book);
    setBooks(books.filter((book) => book !== book));
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
        <div className="text-2">
          <Link to="/author-upload">My Uploads</Link>
        </div>
        <div className="text-3 active">
          <Link to="/author-reading">Reading History</Link>
        </div>
      </nav>

      <div className="wishlist-container">
        <main>
          <h1 className="history-title"></h1>
          <div className="wishlist">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="wishlist-item">
                  <img
                    src={book.coverImage}
                    alt={book.bookTitle}
                    className="book-cover"
                  />
                  <div className="details">
                    <h2 className="book-title">{book.bookTitle}</h2>
                    <p className="book-author">{book.author}</p>
                    {/* <p className="book-price">{book.price}</p>
                                    <p className="book-rating">⭐ {book.rating}</p> */}
                    <Link to={`/reading/${book.id}`} className="read-btn">
                      View
                    </Link>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(book)}
                  >
                    <img src={removeIcon} alt="Remove" />
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-message">Your history is empty.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthorReadingHistory;
