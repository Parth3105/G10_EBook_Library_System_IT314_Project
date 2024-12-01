import React, { useState, useEffect } from 'react'
import carticon from './images/carticon.png'
import homeicon from './images/homeicon.png'
import dropdownicon from './images/dropdownicon.png'
import wishlisticon from './images/wishlisticon.png'
import fliplogo from './images/logo.svg'
import searchIcon from './images/searchicon.png'
import profileicon from './images/profileicon.png'
import bookimage from './images/jaws.png'
import { Link, useNavigate } from 'react-router-dom'
import './SearchFilterResultsAfterLogin.css'
import axios from 'axios'

export default function SearchFilterResultsAfterLogin() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState('');
  const storedUsername = localStorage.getItem('USERNAME');

  useEffect(() => {
    // Fetch user role
    axios.get(`http://localhost:5000/myProfile/${storedUsername}`)
      .then(response => {
        if (response.data.code === 100) {
          setUserRole(response.data.user.userRole);
        }
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });

    // Fetch all books
    axios.get(`http://localhost:5000/getAllBooks`)
      .then(response => {
        setBooks(response.data.books || []);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setBooks([]);
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

  // fetch filtered books
  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (language) params.append('language', language);
    if (searchTerm) params.append('search', searchTerm);
    
    axios
      .get(`http://localhost:5000/searchBook?${params.toString()}`)
      .then((response) => {
        setBooks(response.data.books || []);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setBooks([]);
      });
  };

  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="search-filter-results-after-login">
      <div className="book-search">
        <header className="author-header">
          <div className="logo-icon">
            <img src={fliplogo} alt="FlipThePage" className="logo" />
          </div>
          <div className="actions">
            <img 
              src={homeicon} 
              alt="home" 
              onClick={handleHomeClick}
              style={{ cursor: 'pointer' }}
            />
            <Link to="/Wishlist">
              <img src={wishlisticon} alt="whishlist" />
            </Link>
            <img 
              src={profileicon} 
              alt="profile-photo" 
              onClick={handleProfileClick}
              style={{ cursor: 'pointer' }}
            />
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
                </select>
                <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
              </div>
              <div className="select-wrapper">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="" className="placeholder" disabled hidden>Language</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
                <img src={dropdownicon} alt="" width={12} height={12} className="dropdown-icon" />
              </div>
            </div>
            <button className="apply-filter" onClick={handleApplyFilter}>Apply Filter</button>
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
