import React from 'react';
import Image6 from './images/bgimage2.png';
import './AuthorPageaftersubmit.css';

const AuthorPageaftersubmit = () => {
    const handleClick = () => {
        // Add desired action here
    };

    return (
        <div className="author-page">
            <img className="background-image" src={Image6} alt="Background" />
            <div className="group">
                <div className="rectangle"></div>
                <button className="frame" onClick={handleClick}>
                    <div className="get-started">Get Started</div>
                </button>
                <div className="thank-you">Thank you for submitting!</div>
                <div className="notify-text">We'll notify you as soon as we verify your profile as an author.</div>
            </div>
        </div>
    );
};

export default AuthorPageaftersubmit;
