import React, { useState,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './ReaderReadingHistory.css';
import logo from './images/logo.png';
import homeicon from './images/homeicon.png';
import wishlisticon from './images/wishlisticon.png';
import profileicon from './images/profileicon.png';
import removeIcon from './images/removeicon.png'
import axios from 'axios';

function ReaderReadingHistory() {
  const [activeicon, setActiveicon] = useState("profile");
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
    <div className="reader-history-page">
      <header className="history-header">
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
            <Link to="/wishlist" onClick={() => handleIconClick("wishlist")}>
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
        <div className="item1">
          <Link to="/reader-profile">My Profile</Link>
        </div>
        <div className="item2 active">
          <Link to="/reader-histroy">Reading History</Link>
        </div>
      </nav>
      {/* <div className='reading-books'>
      <section className="books-section">
          <h1>Currently Reading</h1>
          <p>The books that you are currently reading will appeare here.</p>
        </section>
        </div> */}
      <div className="reader-history-container">
            <main>
                <h1 className="reader-history-title"></h1>  
                <div className="reader-history">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book._id} className="reader-history-item">
                                <img src={book.coverImage} alt={book.bookTitle} className="book-cover" />
                                <div className="reader-history-details">
                                    <h2 className="reader-history-book-title">{book.bookTitle}</h2>
                                    <p className="reader-history-book-author">{book.author}</p>
                                    {/* <p className="book-price">{book.price}</p>
                                    <p className="book-rating">⭐ {book.rating}</p> */}
                                    <button to={`/reading/${book.id}`} onClick={() => handleViewClick(book)} className="reader-history-read-btn">
                                        View
                                    </button>
                                </div>
                                <button
                                    className="reader-history-remove-btn"
                                    onClick={() => handleRemove(book)}
                                >
                                    <img src={removeIcon} alt="Remove" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="reader-history-empty-message">Your history is empty.</p>
                    )}
                </div>
            </main>
        </div>
    </div>
  );
}

export default ReaderReadingHistory;