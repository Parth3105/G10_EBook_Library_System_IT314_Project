import React, { useState, useEffect } from 'react';
import './BookDescription.css';
import carticon from './images/carticon.png';
import homeicon from './images/homeicon.png';
import dropdownicon from './images/dropdownicon.png';
import wishlisticon from './images/wishlisticon.png';
import logo from './images/logo.svg';
import searchIcon from './images/searchicon.png';
import profileicon from './images/profileicon.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const BACKEND_URL = "https://flipthepage.onrender.com";
// const BACKEND_URL = "http://localhost:5000";

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function BookDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [activeicon, setActiveicon] = useState("profile");
  const storedUsername = localStorage.getItem('USERNAME');
  const [userRole, setUserRole] = useState('');

  // PDF states
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [showReader, setShowReader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    checkWishlist();
  }, [book]);

  useEffect(() => {
    // Fetch user role
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showReader) return;

      switch (e.key) {
        case 'ArrowLeft':
          previousPage();
          break;
        case 'ArrowRight':
          nextPage();
          break;
        case 'Escape':
          handleCloseReader();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showReader, pageNumber, numPages]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/book/${id}`);

      if (response.data && response.data.code === 200) {
        console.log('Book details:', response.data.book);
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

  const checkWishlist = async () => {
    try {
      if (book && storedUsername) {
        const response = await axios.get(`${BACKEND_URL}/checkWishlist?username=${storedUsername}&bookId=${book._id}`);
        if (response.data.exists) {
          setIsInWishlist(true);
          setWishlistMessage("Added to wishlist");
        } else {
          setIsInWishlist(false);
          setWishlistMessage("Add to wishlist");
        }
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlist = async () => {
    try {
      const wishlistData = {
        username: storedUsername,
        bookTitle: book.title,
        author: book.author,
        coverImage: book.coverImage,
        bookId: book._id
      };

      if (!isInWishlist) {
        const response = await axios.post(`${BACKEND_URL}/addToWishlist`, wishlistData);
        if (response.data.code === 300) {
          setWishlistMessage("Added to wishlist");
          setIsInWishlist(true);
        }
      } else {
        const response = await axios.post(`${BACKEND_URL}/rmFromWishlist`, wishlistData);
        if (response.data.code === 501) {
          setWishlistMessage("Add to wishlist");
          setIsInWishlist(false);
        }
      }
    } catch (error) {
      console.error('Wishlist operation error:', error);
      toast.error('Error performing wishlist operation');
    }
  };

  // PDF functions
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const handleReadClick = () => {
    setIsLoading(true);
    if (book) {
      console.log('PDF URL:', book.file);
    }
    setPdfError(null);
    setShowReader(true);

    axios.post(`${BACKEND_URL}/addHistory`, {
      username: storedUsername,
      bookTitle: book.title,
      author: book.author,
      coverImage: book.coverImage,
      bookId: book._id
    });
  };

  const handleCloseReader = () => {
    setShowReader(false);
    setPageNumber(1);
    setScale(1.0);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      changePage(-1);
    }
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      changePage(1);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!book) {
    return <div className="error">Book not found</div>;
  }

  const getGoogleDriveViewerUrl = (driveUrl) => {
    try {
      if (!driveUrl) return null;

      // Extract file ID from Google Drive URL
      let fileId = '';

      if (driveUrl.includes('/file/d/')) {
        // Format: https://drive.google.com/file/d/FILE_ID/view
        fileId = driveUrl.split('/file/d/')[1].split('/')[0];
      } else if (driveUrl.includes('id=')) {
        // Format: https://drive.google.com/open?id=FILE_ID
        fileId = driveUrl.split('id=')[1].split('&')[0];
      }

      if (!fileId) {
        console.error('Could not extract file ID from URL:', driveUrl);
        return null;
      }

      // Return the embedded viewer URL
      return `https://drive.google.com/file/d/${fileId}/preview`;
    } catch (error) {
      console.error('Error processing Google Drive URL:', error);
      return null;
    }
  };

  return (
    <div className="book-page">
      {!showReader ? (
        <>
          {/* Header Section */}
          <header className="book-description-head">
            <div className="flip-the-page">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="nav-icons">
              <Link to={userRole?.toUpperCase() === 'READER' ? '/reader' : '/author'} onClick={() => handleHomeClick("home")}>
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
              <Link to={userRole?.toUpperCase() === 'READER' ? '/reader-profile' : '/author-profile'} onClick={() => handleProfileClick("profile")}>
                <img
                  src={profileicon}
                  alt="Profile"
                  className={`profileicon ${activeicon === "profile" ? "" : ""}`}
                />
              </Link>
            </div>
          </header>

          {/* Main Section */}
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
                  <button onClick={handleReadClick} className="read-button">Read</button>
                </div>
                <div className="wishlist-share">
                  <button onClick={handleWishlist} className="wishlist-button">
                    <img src={wishlisticon} alt="wishlist icon" className="icon" />
                    {wishlistMessage}
                  </button>
                </div>
              </div>
            </div>
          </main>

          <div className="border2"></div>
          {/* Other Details Section */}
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
      ) : (
        // PDF Reader Interface
        <div className="pdf-reader">
          <div className="pdf-reader-header">
            <h3>{book.title}</h3>
            <div className="pdf-controls">
              <button onClick={handleCloseReader} className="close-reader">
                Close
              </button>
            </div>
          </div>

          <div className="pdf-container">
            <iframe
              src={getGoogleDriveViewerUrl(book.file)}
              title={book.title}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

              loading="lazy"
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}