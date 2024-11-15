// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SelectionPage from './SelectionPage';
import EmailVerification from './EmailVerification';
import RegisterPage from './RegisterPage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import HomePageReader from './HomePageReader';
import HomePageAuthor from './HomePageAuthor' ;
import Home from "./Home";
import AuthorProfile from './AuthorProfile';
import AuthorReadingHistory from './AuthorReadingHistory';
import AuthorUpload from './AuthorUpload';

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
        <Route path="/test" element={<Home />} />
        <Route path="/author-profile" element={<AuthorProfile/>}/>
        <Route path="/author-reading" element={<AuthorReadingHistory/>}/>
        <Route path="/author-upload" element={<AuthorUpload/>}/>

      </Routes>
    </Router>
  );
};

export default App;
