import React, { useState, useEffect } from 'react'
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
import axios from 'axios';

const BACKEND_URL = "http://localhost:5000";

export default function SearchFilterResultsBeforeLogin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all books when component mounts
    axios.get(`${BACKEND_URL}/getAllBooks`)
      .then(response => {
        if (response.data.code === 200) {
          setBooks(response.data.books || []);
        }
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setBooks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (language) params.append('language', language);
    if (searchTerm) params.append('search', searchTerm);
    
    axios
      .get(`${BACKEND_URL}/searchBook?${params.toString()}`)
      .then((response) => {
        setBooks(response.data.books || []);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setBooks([]);
      });
  };

  const handleclearFilter = () => {
    setSearchTerm('');
    setGenre('');
    setLanguage('');
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
          {loading ? (
            <p>Loading books...</p>
          ) : Array.isArray(books) && books.length > 0 ? (
            books.map((book, index) => (
              <div key={index} className="book-card">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="book-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = bookimage; // Your default image
                  }}
                />
                <h3 className="bookname">{book.title}</h3>
                <p className="author-text">{book.author}</p>
                <p className="pricevalue">INR {book.amount}</p>
                <p className="pricevalue">⭐ {book.rating || 5}/5</p>
                <button 
                  className="view-button"
                  onClick={() => navigate(`/book-before/${book._id}`)}
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p>No books found</p>
          )}
        </div>
      </div>
    </div>
  );
}
