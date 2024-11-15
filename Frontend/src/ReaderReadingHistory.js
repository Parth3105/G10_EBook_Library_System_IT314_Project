import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReaderReadingHistory.css';
import logo from './images/logo.png';
import homeicon from './images/homeicon.png';
import wishlisticon from './images/wishlisticon.png';
import profileicon from './images/profileicon.png';
import removeIcon from './images/removeicon.png'
import axios from 'axios';

function ReaderReadingHistory() {
  const storedUsername = localStorage.getItem('USERNAME');
  const [books, setBooks] = useState([]);

  useEffect(()=>{
    axios.get(`http://localhost:5000/readHistory/${storedUsername}`)
    .then(response => {
      if(response.data.code===200){
        setBooks(response.data.history);
      }
    })
  })

  const handleRemove = (book) => {
    axios.post(`http://localhost:5000/rmHistory`,book)
    setBooks(books.filter(book => book !== book));
  };
  
  return (
    <div className="reader-history-page">
      <header className="history-header">
        <div className='logo'>
          <img src={logo} alt="FlipThePage" className="logoicon"/>
        </div>
        <div className="readeraction">
          <Link to="/home" className="home">
            <img src={homeicon} alt="Home" />
          </Link>
          <Link to="/wishlist" className="wishlist">
            <img src={wishlisticon} alt="Wishlist" />
          </Link>
          <Link to="/reader-profile" className="ReaderProfile">
            <img src={profileicon} alt="Profile" />
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
      <div className="wishlist-container">
            <main>
                <h1 className="history-title"></h1>  
                <div className="wishlist">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book._id} className="wishlist-item">
                                <img src={book.coverImage} alt={book.bookTitle} className="book-cover" />
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

export default ReaderReadingHistory;