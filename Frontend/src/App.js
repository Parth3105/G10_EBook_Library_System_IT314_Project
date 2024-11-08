// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SelectionPage from './SelectionPage';
import EmailVerification from './EmailVerification';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SelectionPage" element={<SelectionPage />} />
      </Routes>
    </Router>
  );
};

export default App;



