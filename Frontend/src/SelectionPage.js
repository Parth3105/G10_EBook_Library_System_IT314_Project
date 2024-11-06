// SelectionPage.js

import React from 'react';
import Readericon from './images/readericon.png';
import Authoricon from './images/authoricon.png';
import './SelectionPage.css';

const SelectionPage = () => {
  const handleSelection = (role) => {
    console.log(`You selected: ${role}`);
  };

  return (
    <div className="selection-container">
      <h1>Choose Your Role</h1>
      <div className="button-group">
        <button onClick={() => handleSelection("Reader")} className="role-button">
            <img src={Readericon} alt="Reader Icon" className="icon" /> I'm a Reader
        </button>
        <button onClick={() => handleSelection("Author")} className="role-button">
            <img src={Authoricon} alt="Author Icon" className="icon" /> I'm an Author
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
