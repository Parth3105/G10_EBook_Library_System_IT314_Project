// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SelectionPage from './SelectionPage';
import EmailVerification from './EmailVerification';
import RegisterPage from './RegisterPage';

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
      </Routes>
    </Router>
  );
};

export default App;






