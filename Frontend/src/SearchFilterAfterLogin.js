import React, { useState, useEffect } from 'react'
import carticon from './images/carticon.png'
import homeicon from './images/homeicon.png'
import dropdownicon from './images/dropdownicon.png'
import wishlisticon from './images/wishlisticon.png'
import logo from './images/logo.svg'
import searchIcon from './images/searchicon.png'
import profileicon from './images/profileicon.png'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import './SearchFilterAfterLogin.css'
import axios from 'axios'

const BACKEND_URL = "https://flipthepage.onrender.com";

export default function SearchFilterAfterLogin() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [activeicon, setActiveicon] = useState("profile");
  const storedUsername = localStorage.getItem('USERNAME');

  useEffect(() => {
    // Fetch user role when component mounts
    axios.get(`${BACKEND_URL}/myProfile/${storedUsername}`)
      .then(response => {
        if (response.data.code === 100) {
          setUserRole(response.data.user.userRole);
        }
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
  }, [storedUsername]);

  const handleHomeClick = () => {
    if (userRole?.toUpperCase() === 'AUTHOR') {
      navigate('/author');
    } else {
      navigate('/reader');
    }
  };

  const handleProfileClick = () => {
    if (userRole?.toUpperCase() === 'AUTHOR') {
      navigate('/author-profile');
    } else {
      navigate('/reader-profile');
    }
  };

  const handleIconClick = (icon) => {
    setActiveicon(icon);
  };

  const handleApplyFilter = () => {
    // Implement filter logic here
    console.log('Applying filters:', { searchTerm, genre, name, author, language })
    navigate("/search-results-after");
  }

  return (
    <div className="search-filter-after-login">
  <div className="book-search">
  <header className="after-login-head">
      <div className="flip-the-page">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div className="nav-icons">
            <Link to="/reader" onClick={() => handleHomeClick("home")}>
              <img
                src={homeicon}
                alt="Home"
                className={`homeicon ${activeicon === "home" ? "" : ""}`}
              />
            </Link>
            <Link to="/Wishlist" onClick={() => handleIconClick("wishlist")}>
              <img
                src={wishlisticon}
                alt="Wishlist"
                className={`wishlisticon ${activeicon === "wishlist" ? "" : ""}`}
              />
            </Link>
            <Link to="/reader-profile" onClick={() => handleProfileClick("profile")}>
              <img
                src={profileicon}
                alt="Profile"
                className={`profileicon ${activeicon === "profile" ? "" : ""}`}
              />
            </Link>
          </div>
      </header>
    <main>
      <div className="search-container">
        <input
          type="search"
          placeholder="Search ebooks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div><h2>Filter by:</h2></div>
      <div className="filter-container">   
        <div className="filter-options">
          <div className="select-wrapper">
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="" className="placeholder" disabled hidden>Genre</option>
              <option value="fiction">Romance</option>
              <option value="non-fiction">Thriller</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="mystery">Mystery</option>
            </select>
            <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
          </div>
          <div className="select-wrapper">
            <select value={name} onChange={(e) => setName(e.target.value)}>
              <option value="" className="placeholder" disabled hidden>Name</option>
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
            <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
          </div>
          <div className="select-wrapper">
            <select value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="" className="placeholder" disabled hidden>Author</option>
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
            <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
          </div>
          <div className="select-wrapper">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="" className="placeholder" disabled hidden>Language</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
          </div>
        </div>
        <button className="apply-filter" onClick={handleApplyFilter}>Apply Filter</button>
      </div>
    </main>
  </div>
</div>

    
  )
}
