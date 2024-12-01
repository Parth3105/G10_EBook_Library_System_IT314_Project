// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SelectionPage from './SelectionPage';
import EmailVerification from './EmailVerification';
import RegisterPage from './RegisterPage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import HomePageReader from './HomePageReader';
import HomePageAuthor from './HomePageAuthor';
import AuthorProfile from './AuthorProfile';
import AuthorReadingHistory from './AuthorReadingHistory';
import AuthorUpload from './AuthorUpload';
import Wishlistpage from './Wishlistpage';
import ReaderProfile from './ReaderProfile';
import ReaderReadingHistory from './ReaderReadingHistory';
import BookDescription from './BookDescription';
import AuthorBookUpload from './AuthorBookUpload';
import SearchFilterAfterLogin from "./SearchFilterAfterLogin";
import SearchFilterBeforeLogin from "./SearchFilterBeforeLogin";
import SearchFilterResultsAfterLogin from "./SearchFilterResultsAfterLogin";
import SearchFilterResultsBeforeLogin from "./SearchFilterResultsBeforeLogin";
import BookDescriptionBeforeLogin from "./BookDescriptionBeforeLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SelectionPage" element={<SelectionPage />} />
        <Route path="/verifyEmail" element={<EmailVerification />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reader" element={<HomePageReader />} />
        <Route path="/author" element={<HomePageAuthor />} />
        <Route path="/upload/author" element={<AuthorBookUpload />} />
        <Route path="/author-profile" element={<AuthorProfile />} />
        <Route path="/author-reading" element={<AuthorReadingHistory />} />
        <Route path="/author-upload" element={<AuthorUpload />} />
        <Route path="/Wishlist" element={<Wishlistpage />} />
        <Route path="/reader-profile" element={<ReaderProfile />} />
        <Route path="/reading-history" element={<ReaderReadingHistory />} />
        <Route path="/search-after" element={<SearchFilterResultsAfterLogin  />} />
        <Route path="/search-before" element={<SearchFilterResultsBeforeLogin  />} />
        {/* <Route path="/search-results-after" element={<SearchFilterResultsAfterLogin />} />
        <Route path="/search-results-before" element={<SearchFilterResultsBeforeLogin />} /> */}

        {/* Book Description Routes with and without parameters*/}
        <Route path="/book-description" element={<BookDescription />} />
        <Route path="/book/:id" element={<BookDescription />} />
        <Route path="/book-before/:id" element={<BookDescriptionBeforeLogin />} />

      </Routes>
    </Router>
  );
};

export default App;
