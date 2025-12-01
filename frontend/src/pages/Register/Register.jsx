import { useState } from "react";
import "./register.css";
import loginPic from "/images/loginpage.png";
import googleIcon from "/images/image.png"; // local google icon
import api from "../../api"; 
const BACKEND_URL = import.meta.env.VITE_MYBACKEND_ENV || "http://localhost:3000";


const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);

      if (res.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500); // 1.5 sec delay
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(err.response?.data?.message || "Failed to register");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Create Account</h1>
        <p>Join us today. It only takes a minute.</p>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Full Name"
            required
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">Register</button> 
        </form>

        <p className="divider">OR</p>

        {/* Google Sign-in */}
        <a href={`${BACKEND_URL}/auth/google`} className="google-btn">      
            <img src={googleIcon} alt="Google Logo" className="google-icon"/>
          <span>Sign in with Google</span>
        </a>

        <p className="login-link">Already have an account? <a href="/login">Login here</a></p>
      </div>

      <div className="register-image">
        <img src={loginPic} alt="register" />
      </div>
    </div>
  );
};

export default Register;
