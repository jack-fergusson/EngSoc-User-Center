import { useEffect, useState } from "react";
import api from "../../api";
import "./Login.css";
import loginPic from '/images/loginpage.png';

const Login = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api
      .get("/auth/ping")
      .then((res) => {
        setMessage(res.data.message);
        console.log(res.data.message);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <p>How i get started with Engsoc</p>
        <input type="username" placeholder="Username or Email" />
        <input type="password" placeholder="Enter password" />
        <button className="loginbutton">Login</button>
        <a href="" >Register here</a>
      </div>
      <div className="login-image">
        <img src={loginPic} alt="girl in jacket"   />
      </div>
    </div>
  );
};
export default Login;
