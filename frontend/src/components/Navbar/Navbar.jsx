import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import styles from "./Navbar.module.css";
import EngSocLogo from "../../assets/EngSocLogo.png";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // check login status ONCE when navbar loads
  useEffect(() => {
    api.get("/auth/check", { withCredentials: true })
      .then(res => {
        if (res.data.loggedIn) {
          setLoggedIn(true);
          setUser(res.data.user);
        }
      })
      .catch(() => setLoggedIn(false));
  }, []);

const handleLogout = async () => {
  try {
    await fetch(`http://localhost:3000`, {
      method: "POST",
      credentials: "include",   // <--- REQUIRED// send backend, current user's session data to destroy,after logout
    });

    window.location.href = "/login";
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={EngSocLogo} alt="EngSoc Logo" />
        <h2>
          <Link to="/">EngSoc Student Center</Link>
        </h2>
      </div>

      <ul className={styles.links}>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendar">Calendar</NavLink>
        </li>
        <li>
          <NavLink to="/groups">Groups</NavLink>
        </li>

        {/* LOGIN / LOGOUT TOGGLE */}
        <li>
          {loggedIn ? (
            <button className={styles.login} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login">
              <button className={styles.login}>Login</button>
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
