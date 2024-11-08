// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
<<<<<<< HEAD
import HomePage from './HomePage';
=======
import SelectionPage from './SelectionPage';
import EmailVerification from './EmailVerification';
>>>>>>> b8689b8dc93b5fe955baa61d32c20ffc57a5f8ca

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
        <Route path="/home" element={<HomePage />} /> {/* New Route for HomePage */}
=======
        <Route path="/SelectionPage" element={<SelectionPage />} />
>>>>>>> b8689b8dc93b5fe955baa61d32c20ffc57a5f8ca
      </Routes>
    </Router>
  );
};

export default App;




