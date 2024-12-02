import React, { useState,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import logo from "./images/logo.png";
import homeicon from "./images/homeicon.png";
import wishlisticon from "./images/wishlisticon.png";
import profileicon from "./images/profileicon.png";
import removeIcon from './images/removeicon.png';
import "./AuthorUpload.css";
import axios from 'axios';

function AuthorUpload() {
  const [activeIcon, setActiveicon] = useState("profile");
  const storedUsername = localStorage.getItem('USERNAME');
  const [books, setBooks] = useState([]);

  const navigate=useNavigate();

  useEffect(()=>{
    axios.get(`http://localhost:5000/readHistory/${storedUsername}`)
    .then(response => {
      if(response.data.code===200){
        setBooks(response.data.history);
      }
    })
  })

  const handleIconClick = (icon) => {
    setActiveicon(icon);
  };

  const handleRemove = (book) => {
    axios.post(`http://localhost:5000/rmHistory`,book)
    setBooks(books.filter(book => book !== book));
  };

  const handleViewClick = (book) => {
    navigate(`/book/${book.bookId}`);
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
          <Link to="/reading-history">Reading History</Link>
        </div>
      </nav>

      <div className="author-upload-container">
        <main>
          <h1 className="author-upload-title"></h1>
          <div className="author-upload">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="author-upload-item">
                  <img
                    src={book.coverImage}
                    alt={book.bookTitle}
                    className="book-cover"
                  />
                  <div className="author-upload-details">
                    <h2 className="author-upload-book-title">
                      {book.bookTitle}
                    </h2>
                    <p className="author-upload-book-author">{book.author}</p>
                    {/* <p className="book-price">{book.price}</p>
                                    <p className="book-rating">⭐ {book.rating}</p> */}
                    <button
                      to={`/reading/${book.id}`}
                      onClick={() => handleViewClick(book)}
                      className="reader-history-read-btn"
                    >
                      View
                    </button>
                  </div>
                  <button
                    className="author-upload-remove-btn"
                    onClick={() => handleRemove(book)}
                  >
                    <img src={removeIcon} alt="Remove" />
                  </button>
                </div>
              ))
            ) : (
              <p className="author-upload-empty-message">
                You have not uploaded any books yet.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthorUpload;
