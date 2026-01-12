import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import styles from "./Navbar.module.css";
import EngSocLogo from "../../assets/EngSocLogo.png";
const BACKEND_URL =
  import.meta.env.VITE_MYBACKEND_ENV || "http://localhost:4000";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // check login status ONCE when navbar loads
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/authentication/check", {
          withCredentials: true,
        });
        setLoggedIn(res.data.loggedIn);
        setUser(res.data.user || null);
      } catch {
        setLoggedIn(false);
        setUser(null);
      }
    };

    checkLogin();

    window.addEventListener("authChanged", checkLogin);

    return () => {
      window.removeEventListener("authChanged", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/authentication/logout`, {
        method: "POST",
        credentials: "include", // very important for cookies
      });
      window.dispatchEvent(new Event("authChanged"));

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
