import { useState } from "react";
import api from "../../api";
import "./Login.css";
import loginPic from "/images/loginpage.png";
import googlePic from "/images/image.png";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/login", formData, {
        withCredentials: true,  // important for sessions
      });

      if (res.data.success) {
        window.location.href = "/";  // or your home page
      } else {
        setError(res.data.message || "Invalid login.");
      }
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <p>Welcome back. Please login to continue.</p>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="loginbutton" onClick={handleSubmit}>
          Login
        </button>

        <a href="/register">Register here</a>
        <a href="http://localhost:3000/auth/google" className="google-btn">
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src={googlePic}
              alt="Google Logo"
            />
          </div>
          <span className="btn-text">Sign in with Google</span>
        </a>
      </div>

      <div className="login-image">
        <img src={loginPic} alt="girl in jacket" />
      </div>
    </div>
  );
};

export default Login;
