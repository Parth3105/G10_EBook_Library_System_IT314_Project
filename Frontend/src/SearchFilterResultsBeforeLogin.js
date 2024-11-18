import React, { useState } from 'react'
import carticon from './images/carticon.png'
import homeicon from './images/homeicon.png'
import dropdownicon from './images/dropdownicon.png'
import wishlisticon from './images/wishlisticon.png'
import fliplogo from './images/logo.svg'
import searchIcon from './images/searchicon.png'
import profileicon from './images/profileicon.png'
import bookimage from './images/jaws.png'
import './SearchFilterResultsBeforeLogin.css'
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginPage from './LoginPage';

export default function SearchFilterResultsBeforeLogin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('');

  const handleApplyFilter = () => {
    console.log('Applying filters:', { searchTerm, genre, name, author, language });
  };

  const books = [
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
    { title: 'Jaws: A Novel', author: 'Peter Benchley', price: 'INR 700', rating: 5, image: 'jaws.jpg' },
  ];

  const navigate = useNavigate();

  const handleclearFilter = () => {
    // Implement filter logic here
    navigate("/search-before");
  }


  return (
    <div className="search-filter-results-before-login">
      <div className="book-search">
        <header>
          <div className="logo">
            <img src={fliplogo} alt="fliplogo" className="fliplogo" />
          </div>
          <nav>
            <div className="nav-group">
            <Link to="/LoginPage" className="nav-icon">Login</Link> | 
            <Link to="/Register" className="nav-icon">Register</Link>
            <Link to="/home" className="home">
            <img src={homeicon} alt="Home" className="nav-icon" />
            </Link>
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
              {/*<div className="select-wrapper">
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
              </div>*/}
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
            <div className="buttons">
            <button className="apply-filter" onClick={handleApplyFilter}>Apply Filter</button>
            <button className="clear-filter" onClick={handleclearFilter}>Clear Filter</button>
            </div>
          </div>

          
        </main>
      </div>
      <div className="book-results">
            <h2>Results:</h2>
            <div className="books-grid">
              {books.map((book, index) => (
                <div key={index} className="book-card">
                  <img src={bookimage} alt="booktitle" className="book-image" />
                  <h3 className="bookname">{book.title}</h3>
                  <p className="author-text">{book.author}</p>
                  <p className="pricevalue">{book.price}</p>
                  <p className="pricevalue">⭐ {book.rating}/5</p>
                  <button className="view-button">View</button>
                </div>
              ))}
            </div>
          </div>
    </div>
  );
}
