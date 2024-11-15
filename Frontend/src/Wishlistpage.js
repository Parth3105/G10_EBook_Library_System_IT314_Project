import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Wishlistpage.css';
import homeIcon from './images/homeicon.png'
import wishlistIcon from './images/wishlisticon.png'
import profileIcon from './images/profileicon.png'
import removeIcon from './images/removeicon.png'
import logo from './images/logo.png'
import axios from 'axios';


const Wishlist = () => {
    const [activeIcon, setActiveIcon] = useState('wishlist');
    const [books, setBooks] = useState([]);
    const storedUsername = localStorage.getItem('USERNAME');

    useEffect(()=>{
        axios.get(`http://localhost:5000/getWishlist/${storedUsername}`)
        .then(response => {
          if(response.data.code===300){
            setBooks(response.data.wishlist);
          }
        })
      })

    const handleIconClick = (icon) => {
        setActiveIcon(icon);
    };

    const handleRemove = (book) => {
        axios.post(`http://localhost:5000/rmFromWishlist`,book)
        setBooks(books.filter(book => book!==book));
    };

    return (
        <div className="wishlist-container">
            <header className="header">
                <div className="nav-icon">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <nav className="nav-icons">
                    <Link to="/reader" onClick={() => handleIconClick('home')}>
                        <img
                            src={homeIcon}
                            alt="Home"
                            className={`homeicon ${activeIcon === 'home' ? 'active' : ''}`}
                        />
                    </Link>
                    <Link to="/wishlist" onClick={() => handleIconClick('wishlist')}>
                        <img
                            src={wishlistIcon}
                            alt="Wishlist"
                            className={`wishlisticon ${activeIcon === 'wishlist' ? 'active' : ''}`}
                        />
                    </Link>
                    <Link to="/reader-profile" onClick={() => handleIconClick('profile')}>
                        <img
                            src={profileIcon}
                            alt="Profile"
                            className={`profileicon ${activeIcon === 'profile' ? 'active' : ''}`}
                        />
                    </Link>
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
                                    <Link to={`/reading/`} className="read-btn">
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
                        <p className="empty-message">Your wishlist is empty.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Wishlist;
