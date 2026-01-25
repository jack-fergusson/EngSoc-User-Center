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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Close menu when clicking outside or on window resize to desktop
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(`.${styles.links}`) && !event.target.closest(`.${styles.hamburger}`)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen, styles.links, styles.hamburger]);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className={styles.backdrop} 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src={EngSocLogo} alt="EngSoc Logo" />
          <h2>
            <Link to="/" onClick={closeMenu}>EngSoc Student Center</Link>
          </h2>
        </div>

        {/* Hamburger Menu Button - Mobile Only */}
        <button 
          className={styles.hamburger} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? styles.active : ''}></span>
          <span className={isMenuOpen ? styles.active : ''}></span>
          <span className={isMenuOpen ? styles.active : ''}></span>
        </button>

        {/* Navigation Links */}
        <ul className={`${styles.links} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <li>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
        </li>
        <li>
          <NavLink to="/calendar" onClick={closeMenu}>Calendar</NavLink>
        </li>
        <li>
          <NavLink to="/groups" onClick={closeMenu}>Groups</NavLink>
        </li>
        <li>
          <NavLink to="/fqa" onClick={closeMenu}>FQA</NavLink>
        </li>

        {/* LOGIN / LOGOUT TOGGLE */}
        <li>
          {loggedIn ? (
            <button className={styles.login} onClick={() => { closeMenu(); handleLogout(); }}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>
              <button className={styles.login}>Login</button>
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
    </>
  );
}
