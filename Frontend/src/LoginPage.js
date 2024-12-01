import React from "react";
import { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import fliplogo from "./images/logo.svg";
import bgimg from "./images/bgimage1.png";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    console.log(username, password);
    axios
      .post("http://localhost:5000/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.code === 400) {
          toast.error(res.data.msg);
        }
        else if (res.data.code === 404) {
          toast.error(res.data.msg);
        }
        else if (res.data.code === 200) {
          localStorage.setItem("TOKEN", res.data.token);
          localStorage.setItem("USERNAME", username);

          toast.success('Login successful!', {
            autoClose: 1000,
            onClose: () => {
              if (res.data.userRole === "Reader") {
                navigate("/reader");
              }
              else if (res.data.userRole === "Author") {
                navigate("/author");
              }
              else if (res.data.userRole === "Admin") {
                // Navigation path for admin
              }
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occurred. Please try again.');
      });
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="left-section">
        <img src={bgimg} alt="Tablet" className="tablet-image" />
      </div>
      <div className="right-section">
        <div className="logo">
          <img src={fliplogo} alt="Logo" />
        </div>
        <h2>Log in to your Account</h2>
        <form className="login-form">
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            type="text"
            placeholder="Username"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className="inputs"
            type="password"
            placeholder="Password"
          />
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button onClick={handleSubmit} type="submit" className="register-btn">
            Log In
          </button>
        </form>
        <div className="additional-options">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <button className="google-login">Continue with Google</button>

        {/* Replaced anchor tag with Link component */}
        <p className="register-link">
          Not Registered Yet? <Link to="/SelectionPage">Register Now</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
