import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookDescription.css';

// Import images
import logo from './images/logo.svg';
import homeicon from './images/homeicon.png';

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

export default function BookDescriptionBeforeLogin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeicon] = useState("profile");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/book/${id}`);

      if (response.data && response.data.code === 200) {
        setBook(response.data.book);
      } else {
        toast.error('Book not found');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Error fetching book details');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!book) {
    return <div className="error">Book not found</div>;
  }

  return (
    <div className="book-page">
      {!showReader ? (
        <>
          <header className="book-description-head">
            <div className="flip-the-page">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="nav-icons">
              <Link to="/home" onClick={() => handleHomeClick("home")}>
                <img
                  src={homeicon}
                  alt="Home"
                  className={`homeicon ${activeicon === "home" ? "" : ""}`}
                />
              </Link>
            </div>
          </header>

          <main className="main-content">
            <div className="book-details">
              <img
                src={book.coverImage}
                alt={book.title}
                className="book-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-book-cover.jpg';
                }}
              />
              <div className="book-info">
                <h2>{book.title}</h2>
                <p className="authorname">By {book.author}</p>
                <p className="rating">⭐ 5/5</p>
                <p className="price">INR {book.amount}</p>
                <div className="descriptioncontainer">
                  {book.description}
                </div>
                <div className="button-group">
                  <p className="login-message">Please login to read this book</p>
                </div>
              </div>
            </div>
          </main>

          <div className="border2"></div>
          <div className="container">
            <div className="left-column">
              <h2 className="title">Other Details</h2>
            </div>
            <div className="right-column">
              <div className="detail">
                <span className="Genre">Genre: </span>
                <span className="typeof">{book.genre || 'Adventure/Fiction'}</span>
              </div>
              <div className="detail">
                <span className="language">Language: </span>
                <span className="typeof">{book.language || 'English'}</span>
              </div>
              <div className="detail">
                <span className="Genre">Pages: </span>
                <span className="typeof">{book.pages || '208'}</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <ToastContainer />
    </div>
  );
}