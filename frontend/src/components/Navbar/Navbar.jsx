import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import EngSocLogo from "../../assets/EngSocLogo.png";

export default function Navbar() {
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
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/calendar">Calendar</NavLink>
        </li>
        <li>
          <NavLink to="/groups">Groups</NavLink>
        </li>
        <li>
          <NavLink to="/login">
            <button className={styles.login}>Login</button>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
