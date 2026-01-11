import { useEffect, useState } from "react";
import api from "../../api";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check login status and fetch user info
    api
      .get("/authentication/check")
      .then((res) => {
        if (!res.data.loggedIn) {
          window.location.href = "/login"; // Redirect if not logged in
        } else {
          setUser(res.data.user); // Set user data
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  return (
    <div>
      <h1>{user ? `Welcome ${user.username}` : "Loading..."}</h1>
    </div>
  );
};

export default Home;
