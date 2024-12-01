import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookDescription.css';

// Import images
import fliplogo from './images/logo.svg';
import homeicon from './images/homeicon.png';

export default function BookDescriptionBeforeLogin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/book/${id}`);

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