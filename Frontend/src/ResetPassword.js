import React, { useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./ResetPassword.css";
import fliplogo from './images/logo.svg';
import bgimg from './images/bgimage1.png';

const BACKEND_URL = "https://flipthepage.onrender.com";

function ResetPassword() {
  const location=useLocation();
  const prevState=location.state||{};
  const navigate=useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmit= (e)=>{
    e.preventDefault();

    axios.post(`${BACKEND_URL}/resetPassword`, {email: prevState.email, password: password, confirmPass: confirmPass})
      .then((res)=>{
        if(res.data.code === 700){
          navigate("/LoginPage");
          alert(res.data.msg);
        }
        else{
          alert(res.data.msg);
        }
      });
  }

  return (
    <div className="reset-page">
      <div className="left-section">
        <img src={bgimg} alt="Tablet" className="tablet-image" />
      </div>
      <div className="right-section">
        <div className="logo">
          <img src={fliplogo} alt="Logo" />
        </div>
        <h2>Reset Password</h2>
        <form className="reset-form">
          <input
          onChange = {(e)=>{
            setPassword(e.target.value);
          }} 
          type="password" 
          placeholder="New Password" 
          required/>
          <input
          onChange = {(e)=>{
            setConfirmPass(e.target.value);
          }} 
          type="password" 
          placeholder="Confirm New Password" 
          required/>
          <button type="submit" onClick={handleSubmit} className="reset-btn">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
