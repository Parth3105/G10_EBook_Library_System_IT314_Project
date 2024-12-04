import React, { useState, useEffect } from 'react'
import carticon from './images/carticon.png'
import homeicon from './images/homeicon.png'
import dropdownicon from './images/dropdownicon.png'
import wishlisticon from './images/wishlisticon.png'
import logo from './images/logo.svg'
import searchIcon from './images/searchicon.png'
import profileicon from './images/profileicon.png'
import bookimage from './images/jaws.png'
import { Link, useNavigate } from 'react-router-dom'
import './SearchFilterResultsAfterLogin.css'
import axios from 'axios'

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

export default function SearchFilterResultsAfterLogin() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [activeicon, setActiveicon] = useState("profile");
  const storedUsername = localStorage.getItem('USERNAME');

  const fetchProfile = async () => {
    axios.get(`${BACKEND_URL}/myProfile/${storedUsername}`)
      .then(response => {
        if (response.data.code === 100) {
          setUserRole(response.data.user.userRole);
        }
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
  }

  const fetchAllBooks = async () => {
    axios.get(`${BACKEND_URL}/getAllBooks`)
      .then(response => {
        setBooks(response.data.books || []);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setBooks([]);
      });
  }

  useEffect(() => {
    // Fetch user role
    fetchProfile();


    // Fetch all books
    fetchAllBooks();

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

  // fetch filtered books
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
    navigate("/search-after");
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setGenre('');
    setLanguage('');
    fetchAllBooks();

  };

  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleIconClick = (icon) => {
    setActiveicon(icon);
  };

  return (
    <div className="search-filter-results-after-login">
      <div className="book-search">
        <header className="after-result-login-head">
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
                  <option value="comedy">Comedy</option>
                  <option value="adventure">Adventure</option>
                  <option value="drama">Drama</option>
                  <option value="action">Action</option>
                  <option value="horror">Horror</option>
                  <option value="biography">Biography</option>
                  <option value="history">History</option>
                  <option value="education">Education</option>
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
                  <option value="hi">Hindi</option>
                  <option value="sa">Sanskrit</option>
                </select>
                <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
              </div>
            </div>
            <button className="apply-filter" onClick={handleApplyFilter}>Apply Filter</button>
            <button className="clear-filter" onClick={handleClearFilter}>Clear Filter</button>
          </div>


        </main>
      </div>
      <div className="book-results">
        <h2>Results:</h2>
        <div className="books-grid">
          {Array.isArray(books) && books.length > 0 ? (
            books.map((book, index) => (
              <div key={index} className="book-card">
                <img src={book.coverImage} alt="booktitle" className="book-image" />
                <h3 className="bookname">{book.title}</h3>
                <p className="author-text">{book.author}</p>
                <button
                  className="view-button"
                  onClick={() => handleViewBook(book._id)}
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
