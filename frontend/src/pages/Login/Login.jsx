import { useEffect, useState } from "react";
import api from "../../api";

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
    <div>
      <h1>Login</h1>
      <p>{message}</p>
    </div>
  );
};
export default Login;
