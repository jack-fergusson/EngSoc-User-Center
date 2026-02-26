import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api"; // axios instance
import "./Login.css";
import loginPic from "/images/loginpage.png";
import googlePic from "/images/image.png";
const BACKEND_URL = import.meta.env.VITE_MYBACKEND_ENV;

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/authentication/login", formData, {
        withCredentials: true, // required for session cookies
      });

      if (res.data.success) {
        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        window.dispatchEvent(new Event("authChanged"));
      } else {
        setError(res.data.message || "Wrong credentials. Try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <p>Welcome back. Please login to continue.</p>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        <input
          type="text"
          name="username"
          placeholder="Email"
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

        <button className="login-btn" onClick={handleSubmit}>
          Login
        </button>

        <p className="divider">OR</p>

        {/* Google Sign-In */}
        <a href={`${BACKEND_URL}/authentication/google`} className="google-btn">
          <img src={googlePic} alt="Google Logo" className="google-icon" />
          <span>Sign in with Google</span>
        </a>

        {/* NetID Sign-In */}
        <Link to="/login/netid" className="netid-btn">
          <span className="netid-btn-icon">ID</span>
          <span>Login with NetID</span>
        </Link>

        <p className="login-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>

      <div className="login-image">
        <img src={loginPic} alt="login illustration" />
      </div>
    </div>
  );
};

export default Login;
