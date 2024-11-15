import React from 'react';
import { Link } from 'react-router-dom';
import './ReaderProfile.css';
import logo from './images/logo.png';
import homeicon from './images/homeicon.png';
import wishlisticon from './images/wishlisticon.png';
import profileicon from './images/profileicon.png';

function ReaderProfile() {
  return (
    <div className="reader-profile-page">
      <header className="reader-header">
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
        <div className="item1 active">
          <Link to="/reader-profile">My Profile</Link>
        </div>
        <div className="item2">
          <Link to="/reader-history">Reading History</Link>
        </div>
      </nav>
      <div className="reader-content">
        <section className="details-section">
          <h1>Details</h1>
          <div className="details">
            <div className="input-group">
              <label>Firstname</label>
              <input type="text" name="firstname" value="johnmurphy" readOnly/>
            </div>
            <div className="input-group">
              <label>Lastname</label>
              <input type="text" name="lastname" value="johnmurphy" readOnly/>
            </div>
            <div className="input-group">
              <label>Role</label>
              <input type="text" name="role" value="reader" readOnly/>
            </div>
          </div>
          <div className="reader-user-input">
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value="johnmurphy" readOnly/>
            </div>
          </div>
        </section>
        <section className="books-section">
          <h1>Rented Books</h1>
          <p>No books rented yet.</p>
        </section>
        <section className="books-section">
          <h1>Purchased Books</h1>
          <p>No books purchased yet.</p>
        </section>
      </div>
    </div>
  );
}

export default ReaderProfile;
