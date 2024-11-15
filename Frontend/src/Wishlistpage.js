import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Wishlistpage.css';
import homeIcon from './images/homeicon.png'
import wishlistIcon from './images/wishlisticon.png'
import profileIcon from './images/profileicon.png'
import removeIcon from './images/removeicon.png'
import logo from './images/logo.png'
import imageUrl1 from './images/jaws.png'
import imageUrl2 from './images/Alchemist.png'



const Wishlist = () => {
    const [activeIcon, setActiveIcon] = useState('wishlist');
    const [books, setBooks] = useState([
        {
            id: 1,
            title: 'Jaws: A Novel',
            author: 'Peter Benchley',
            price: 'INR. 700',
            rating: '5/5',
            imageUrl: imageUrl1,
        },
        {
            id: 2,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            price: 'INR. 700',
            rating: '5/5',
            imageUrl: imageUrl2,
        },
        
    ]);

    const handleIconClick = (icon) => {
        setActiveIcon(icon);
    };

    const handleRemove = (id) => {
        setBooks(books.filter(book => book.id !== id));
    };

    console.log("Whishlist Page");

    return (
        <div className="wishlist-container">
            <header className="header">
                <div className="nav-icon">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <nav className="nav-icons">
                    <Link to="/Home" onClick={() => handleIconClick('home')}>
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
                    <Link to="/profile" onClick={() => handleIconClick('profile')}>
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
                            <div key={book.id} className="wishlist-item">
                                <img src={book.imageUrl} alt={book.title} className="book-cover" />
                                <div className="details">
                                    <h2 className="book-title">{book.title}</h2>
                                    <p className="book-author">{book.author}</p>
                                    <p className="book-price">{book.price}</p>
                                    <p className="book-rating">⭐ {book.rating}</p>
                                    <Link to={`/reading/${book.id}`} className="read-btn">
                                        Read
                                    </Link>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(book.id)}
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
