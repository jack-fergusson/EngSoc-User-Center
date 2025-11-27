import { useState } from "react";
import "./register.css";
import loginPic from "/images/loginpage.png";
import api from "../../api"; 

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
      if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("FormData on submit:", formData);
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", formData);

      console.log("REGISTER RESPONSE:", res.data);

      if (res.data.success) {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
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

          <button type="submit">Register</button> 
        </form>

        <a href="/login">Already have an account?</a>
      </div>

      <div className="register-image">
        <img src={loginPic} alt="register" />
      </div>
    </div>
  );
};

export default Register;
