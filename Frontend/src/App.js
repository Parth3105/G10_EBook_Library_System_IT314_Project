// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import SelectionPage from './SelectionPage';
//import EmailVerification from './EmailVerification';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/SelectionPage" element={<SelectionPage />} />
      </Routes>
    </Router>
  );
};

export default App;





