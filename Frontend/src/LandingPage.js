import React from 'react';
import './LandingPage.css';
import bgVideo from './videos/bg1.mp4';
import topIcon from './images/bookminiwhite.png';
import ebooksImage from './images/landingImage.png';

const LandingPage = () => {
  const handleClick = () => {
    // Add desired action here 
  };

  return (
    <div className="landing-page">
      <video autoPlay muted loop className="background-video">
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <img src={topIcon} alt="Landing Page Icon" className="top-icon" />
        <h1 className="title">
          <span className="welcome-to">Welcome to </span>
          <span className="flip-the-page">FlipThePage</span>
        </h1>
        <p className="description">
          Discover a world of ebooks across all genres—fiction, non-fiction,
          academics, and more. Whatever your reading preference, FlipThePage
          offers something for everyone.
        </p>
        <img src={ebooksImage} alt="Ebooks" className="ebooks-image" />
        <button
          className="get-started-button"
          onClick={handleClick} // Placeholder action
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;