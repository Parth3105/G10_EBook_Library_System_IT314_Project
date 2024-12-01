import React from 'react';
import './AuthorPage.css';
import Image6 from './images/bgimage2.png';

const Authorpage = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`File selected: ${file.name}`);
    }
  };

  const handleClick = () => {
    console.log('Submit button clicked');
  };

  return (
    <div className="Authorpage">
      <img className="Image6" src={Image6} alt="Background" />
      <div className="Group36">
        <div className="Rectangle6" />
        <div className="Group32">
          <div className="LinkOfTheBookIfTheBookIsAvailableOnline">
            Link of the book (if the book is available online)
          </div>
          <div className="Rectangle10" />
          <div className="HttpsAbcxyzCom10">https://abcxyz.com</div>
        </div>
        <div className="Group31">
          <div className="SocialMediaHandleIfAny">Social media handle (if any)</div>
          <div className="Rectangle11" />
          <div className="HttpsAbcxyzCom11">https://abcxyz.com</div>
        </div>
        <div className="Group35">
          <div className="AnyBookWrittenByYou">Any book written by you</div>
          <div className="Rectangle8" />
          <div className="Abcxyz">abcxyz</div>
        </div>
        <div className="Group34">
          <div className="Name">Name</div>
          <div className="Rectangle7" />
          <div className="Johndunphy">johndunphy</div>
        </div>
        <div className="Group33">
          <label htmlFor="fileInput" className="UploadButton">
            <div className="UploadBook">Upload book</div>
            <div className="Rectangle9" />
            <div className="ChooseFile">Choose file</div>
          </label>
          <input
            id="fileInput"
            type="file"
            className="FileInputHidden"
            onChange={handleFileUpload}
          />
        </div>
        <div className="Frame7" onClick={handleClick}>
          <div className="Submit">Submit</div>
        </div>
      </div>
    </div>
  );
};

export default Authorpage;
