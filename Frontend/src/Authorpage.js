import React, { useState } from 'react';
import './AuthorPage.css';
import Image6 from './images/bgimage2.png';

const AuthorPage = () => {
  const [authorDetails, setAuthorDetails] = useState({
    name: '',
    writtenBook: '',
    bookLink: '',
    socialMedia: '',
    uploadedFile: null,
  });

  const handleChange = (e) => {
    
  };

  const handleFileUpload = (e) => {
    setAuthorDetails({ ...authorDetails, uploadedFile: e.target.files[0] });
  };

  const handleSubmit = () => {
    console.log('Submitted Data:', authorDetails);
    // Add API call or other desired action
    alert('Details submitted successfully!');
  };

  return (
    <div className="Authorpage" style={{ width: '100%', height: '100%', position: 'relative', background: '#FEF8E8' }}>
      <img
        className="Image6"
        style={{ width: 1440, height: 1024, position: 'absolute' }}
        src={Image6}
        alt="Background"
      />
      <div className="Group36">
        <div className="Rectangle6"></div>

        {/* Name */}
        <div className="Group34">
          <label className="Name">Name</label>
          <input
            type="text"
            className="Rectangle7"
            name="name"
            placeholder="Enter your name"
            value={authorDetails.name}
            onChange={handleChange}
          />
        </div>

        {/* Written Book */}
        <div className="Group35">
          <label className="AnyBookWrittenByYou">Any book written by you</label>
          <input
            type="text"
            className="Rectangle8"
            name="writtenBook"
            placeholder="Enter book name"
            value={authorDetails.writtenBook}
            onChange={handleChange}
          />
        </div>

        {/* Book Link */}
        <div className="Group32">
          <label className="LinkOfTheBookIfTheBookIsAvailableOnline">
            Link of the book (if available online)
          </label>
          <input
            type="url"
            className="Rectangle10"
            name="bookLink"
            placeholder="https://abcxyz.com"
            value={authorDetails.bookLink}
            onChange={handleChange}
          />
        </div>

        {/* Social Media Handle */}
        <div className="Group31">
          <label className="SocialMediaHandleIfAny">Social media handle (if any)</label>
          <input
            type="text"
            className="Rectangle11"
            name="socialMedia"
            placeholder="https://socialmedia.com/your-profile"
            value={authorDetails.socialMedia}
            onChange={handleChange}
          />
        </div>

        {/* Upload Book */}
        <div className="Group33">
          <label className="UploadBook">Upload book</label>
          <input
            type="file"
            className="Rectangle9"
            onChange={handleFileUpload}
          />
          {authorDetails.uploadedFile && (
            <span className="UploadedFileName">{authorDetails.uploadedFile.name}</span>
          )}
        </div>

        {/* Submit Button */}
        <button className="Frame7" onClick={handleSubmit}>
          <span className="Submit">Submit</span>
        </button>
      </div>
    </div>
  );
};

export default AuthorPage;
