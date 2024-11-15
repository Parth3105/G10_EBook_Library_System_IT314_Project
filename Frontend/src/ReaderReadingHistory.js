import React from 'react';
import { Link } from 'react-router-dom';
import './ReaderReadingHistory.css';
import logo from './images/logo.png';
import homeicon from './images/homeicon.png';
import wishlisticon from './images/wishlisticon.png';
import profileicon from './images/profileicon.png';

function ReaderReadingHistory() {
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
      <div className='reading-books'>
      <section className="books-section">
          <h1>Currently Reading</h1>
          <p>The books that you are currently reading will appeare here.</p>
        </section>
        </div>
    </div>
  );
}

export default ReaderReadingHistory;