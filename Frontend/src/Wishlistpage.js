import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import './Wishlistpage.css';
import homeIcon from './images/homeicon.png'
import wishlistIcon from './images/wishlisticon.png'
import profileIcon from './images/profileicon.png'
import removeIcon from './images/removeicon.png'
import logo from './images/logo.png'
import axios from 'axios';

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

const Wishlist = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState('wishlist');
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState('');
  const storedUsername = localStorage.getItem('USERNAME');
  // console.log(userRole);

  useEffect(() => {
    // Fetch user profile to get role
    axios.get(`${BACKEND_URL}/myProfile/${storedUsername}`)
      .then(response => {
        if (response.data.code === 100) {
          setUserRole(response.data.user.userRole);
        }
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });

    // Fetch wishlist
    axios.get(`${BACKEND_URL}/getWishlist/${storedUsername}`)
      .then(response => {
        if (response.data.code === 300) {
          setBooks(response.data.wishlist);
        }
      });
  }, [storedUsername]);

  const handleIconClick = (icon) => {
    setActiveIcon(icon);
  };

  const handleRemove = (book) => {
    axios.post(`${BACKEND_URL}/rmFromWishlist`, book)
    setBooks(books.filter(book => book !== book));
  };

  const handleViewClick = (book) => {
    // console.log(book._id);
    navigate(`/book/${book.bookId}`);
  };

  const handleHomeClick = () => {
    handleIconClick('home');
    if (userRole === 'Author') {
      navigate('/author');
    } else {
      navigate('/reader');
    }
  };

  const handleProfileClick = () => {
    handleIconClick('profile');
    if (userRole === 'Author') {
      navigate('/author-profile');
    } else {
      navigate('/reader-profile');
    }
  };

  return (
    <div className="wishlist-container">
      <header className="header">
        <div className="nav-icon">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <nav className="nav-icons">
          <img
            src={homeIcon}
            alt="Home"
            className={`homeicon ${activeIcon === 'home' ? 'active' : ''}`}
            onClick={handleHomeClick}
          />
          <Link to="/wishlist" onClick={() => handleIconClick('wishlist')}>
            <img
              src={wishlistIcon}
              alt="Wishlist"
              className={`wishlisticon ${activeIcon === 'wishlist' ? 'active' : ''}`}
            />
          </Link>
          <img
            src={profileIcon}
            alt="Profile"
            className={`profileicon ${activeIcon === 'profile' ? 'active' : ''}`}
            onClick={handleProfileClick}
          />
        </nav>
      </header>
      <main>
        <h1 className="wishlist-title">My Wishlist</h1>
        <div className="wishlist">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book} className="wishlist-item">
                <img src={book.coverImage} alt={book.bookTitle} className="book-cover" />
                <div className="details">
                  <h2 className="book-title">{book.bookTitle}</h2>
                  <p className="book-author">{book.author}</p>
                  <button onClick={() => handleViewClick(book)} className="read-btn">
                    View
                  </button>
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
            <p className="empty-message">Your wishlist is empty.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
