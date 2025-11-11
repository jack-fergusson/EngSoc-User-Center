import styles from "./Footer.module.css";
import EngSocLogo from "../../assets/EngSocLogo.png";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.about}>
          <div className={styles.logo}>
            <img src={EngSocLogo} alt="Engineering Society Logo" />
            <h2>
              EngSoc Student Center - Developed by{" "}
              <a href="https://www.instagram.com/queens.essdev/">ESSDev</a>
            </h2>
          </div>
          <div className={styles.paragraph}></div>
        </div>
        <div className={styles.links}>Links</div>
        <div className={styles.contact}>Contact</div>
      </div>
      <div className={styles.rights}>Rights</div>
    </div>
  );
};
export default Footer;
