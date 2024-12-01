import React, { useState } from "react";
import "./RegisterPage.css";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import fliplogo from "./images/logo.png";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
  // Retrieve the passed role from the location state
  const location = useLocation();
  const { role } = location.state || {}; // Destructure the role from state

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: role,
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("http://localhost:5000/register", formData)
      .then((result) => {
        if (result.data.code === 400) {
          toast.error(result.data.msg);
        }
        else if (result.data.code === 401) {
          toast.error(result.data.msg);
        }
        else if (result.data.code === 402) {
          toast.error(result.data.msg);
        }
        else if (result.data.code === 403) {
          toast.error(result.data.msg);
        }
        else if (result.data.code === 404) {
          toast.error(result.data.msg);
        }
        else {
          toast.success('Registration successful!');
          navigate("/verifyEmail", { state: result.data.data.userInput });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occurred. Please try again.');
      });
  };

  return (
    <div className="register-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="left-section">
        {/* Add content for left section if needed */}
      </div>
      <div className="right-section">
        <div className="logo1">
          <img src={fliplogo} alt="Logo" />
        </div>

        <h2 className="register-heading">Register Your Account</h2>

        {/* Display the selected role */}
        {role && <p className="role-info">You are registering as: {role}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p className="login-link">
          Already Registered?{" "}
          <Link to="/LoginPage" className="Login-Page">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
