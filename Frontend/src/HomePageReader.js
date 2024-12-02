import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HomePageReader.css';

// Importing images
import Logo from './images/logo.svg';
import searchicon from './images/searchicon.png';
import FeaturedBooks from './images/featuredBooks.png';
import Jaws from './images/jaws.png';
import Hobbit from './images/hobbit.png';
import Alchemist from './images/Alchemist.png';
import Catch from './images/catch.png';
import James from './images/james.png';
import Rowling from './images/rowling.png';
import Amish from './images/amish.png';
import Chitra from './images/chitra.png';
import Ruskin from './images/ruskin.png';
import Amrita from './images/amrita.png';
import John from './images/john.png';
import Haruki from './images/haruki.png';
import Mystery from './images/mystery.png';
import Romance from './images/romance.png';
import SciFi from './images/scifi.png';
import Fantasy from './images/fantasy.png';
import Home from './images/homeicon.png';
import Wishlist from './images/wishlisticon.png';
import Profile from './images/profileicon.png';

const BACKEND_URL = "https://flipthepage.onrender.com";

function HomePageReader() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const getCurrentMonth = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonth = new Date().getMonth(); // Returns 0-11
        return months[currentMonth];
    };

    const fetchBooks = async () => {
        try {
            setLoading(true);
            // console.log('Fetching books...'); // Debug log

            const response = await axios.get(`${BACKEND_URL}/getAllBooks`);
            // console.log('API Response:', response.data); // Debug log
            // console.log('API Response:', response.dat); // Debug log
            // Debug log

            if (response.data) {
                if (response.data.books && response.data.books.length > 0) {
                    setBooks(response.data.books);
                    // console.log('Books set:', response.data.books); // Debug log
                } else {
                    // console.log('No books received from API'); // Debug log
                    setBooks([]);
                }
            } else {
                toast.error(response.data?.msg || 'Error fetching books');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch books');
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        navigate("/search-after");
    };

    const handleViewBook = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div className="homepage-reader">

            <ToastContainer />
            <header className="header">
                <img src={Logo} alt="FlipThePage Logo" className="logo" />
                <div className="search-container">
                    <input onClick={handleSearch} type="text" placeholder="Search ebooks" className="search-bar" />
                    <img src={searchicon} alt="Search Icon" className="searchicon" />
                </div>
                <div className="icon-links">
                    <img src={Home} alt="Icon1" className="header-icon-reader" onClick={() => navigate('/reader')} />
                    <img src={Wishlist} alt="Icon2" className="header-icon-wishlist" onClick={() => navigate('/Wishlist')} />
                    <img src={Profile} alt="Icon3" className="header-icon-profile" onClick={() => navigate('/reader-profile')} />
                </div>
            </header>

            <section className="featured-books">
                <div className="featured-text">
                    <p className="featured-heading">FLIPTHEPAGE RECOMMENDATION</p>
                    <h2>Featured Books of the<span>{getCurrentMonth()}</span></h2>
                    <button className="see-more-btn">See More</button>
                </div>
                <div className="featured-images">
                    <img src={FeaturedBooks} alt="Featured Books" />
                </div>
            </section>




            <section className="genres">
                <div className="genres-header">
                    <h2>Popular Genres</h2>
                </div>
                <div className="genres-list">
                    <div className="genre-item">
                        <img src={Mystery} alt="Mystery/Suspense" />
                        <p>Mystery/Suspense</p>
                    </div>
                    <div className="genre-item">
                        <img src={Romance} alt="Romance Novels" />
                        <p>Romance Novels</p>
                    </div>
                    <div className="genre-item">
                        <img src={SciFi} alt="Science Fiction" />
                        <p>Science Fiction</p>
                    </div>
                    <div className="genre-item">
                        <img src={Fantasy} alt="Fantasy" />
                        <p>Fantasy</p>
                    </div>
                </div>
            </section>


            <section className="deals">
            <h2>Featured Books</h2>
                <div className="deal-cards">
                    {loading ? (
                        <div className="loading-spinner">Loading books...</div>
                    ) : books && books.length > 0 ? (
                        books.slice(0, 5).map((book) => (
                            <div key={book._id} className="deal-card">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    onError={(e) => {
                                        console.log('Image error for:', book.title);
                                        e.target.onerror = null;
                                        e.target.src = '/default-book-cover.jpg';
                                    }}
                                />
                                <h3>{book.title}</h3>
                                <p>{book.author}</p>
                                <p>
                                    INR {book.amount}
                                    <span className="old-price">
                                        INR {Math.floor(book.amount)}
                                    </span>
                                </p>
                                <span>⭐ {book.rating || '5'}/5</span>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => handleViewBook(book._id)}
                                >
                                    View
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-books">No books available</div>
                    )}
                </div>
            </section>


            <section className="authors">
                <h2>Readers’ Favourite Authors</h2>
                <div className="author-list">
                    {/* First set of authors */}
                    <div className="author">
                        <img src={James} alt="James Patterson" />
                        <p>James Patterson</p>
                    </div>
                    <div className="author">
                        <img src={Rowling} alt="J.K. Rowling" />
                        <p>J.K. Rowling</p>
                    </div>
                    <div className="author">
                        <img src={Amish} alt="Amish Tripathi" />
                        <p>Amish Tripathi</p>
                    </div>
                    <div className="author">
                        <img src={Chitra} alt="Chitra Banerjee" />
                        <p>Chitra Banerjee</p>
                    </div>


                    {/* Duplicate the authors to enable continuous scrolling */}
                    <div className="author">
                        <img src={Ruskin} alt="Ruskin Bond" />
                        <p>Ruskin Bond</p>
                    </div>
                    <div className="author">
                        <img src={Amrita} alt="Amrita Pritam" />
                        <p>Amrita Pritam</p>
                    </div>
                    <div className="author">
                        <img src={John} alt="John Green" />
                        <p>John Green</p>
                    </div>
                    <div className="author">
                        <img src={Haruki} alt="Haruki Murakami" />
                        <p>Haruki Murakami</p>
                    </div>


                    {/* Duplicate the authors to enable continuous scrolling */}
                    <div className="author">
                        <img src={James} alt="James Patterson" />
                        <p>James Patterson</p>
                    </div>
                    <div className="author">
                        <img src={Rowling} alt="J.K. Rowling" />
                        <p>J.K. Rowling</p>
                    </div>
                    <div className="author">
                        <img src={Amish} alt="Amish Tripathi" />
                        <p>Amish Tripathi</p>
                    </div>
                    <div className="author">
                        <img src={Chitra} alt="Chitra Banerjee" />
                        <p>Chitra Banerjee</p>
                    </div>
                </div>
            </section>

        </div>
    );
}


export default HomePageReader;