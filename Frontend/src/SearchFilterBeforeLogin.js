import React, { useState } from 'react'
import carticon from './images/carticon.png'
import homeicon from './images/homeicon.png'
import dropdownicon from './images/dropdownicon.png'
import wishlisticon from './images/wishlisticon.png'
import fliplogo from './images/logo.svg'
import searchIcon from './images/searchicon.png'
import profileicon from './images/profileicon.png'
import './SearchFilterBeforeLogin.css'
import { useNavigate } from "react-router-dom";

export default function SearchFilterBeforeLogin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [genre, setGenre] = useState('')
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [language, setLanguage] = useState('')

  const navigate = useNavigate();

  const handleApplyFilter = () => {
    // Implement filter logic here
    console.log('Applying filters:', { searchTerm, genre, name, author, language })
    navigate("/SearchFilterResultsBeforeLogin");
  }

  return (
    <div className="search-filter-before-login">
  <div className="book-search">
    <header>
      <div className="logo">
        <img src={fliplogo} alt="fliplogo" className="fliplogo" />
      </div>
      <nav>
        <div className="nav-group">
          <a href="#login" className="login-link">Login</a> | 
          <a href="#register" className="register-link">Register</a>
          <a href="#home" className="home-icon">
            <img src={homeicon} alt="Home" className="nav-icon" />
          </a>
        </div>
      </nav>
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
