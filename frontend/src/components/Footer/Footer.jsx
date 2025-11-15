import styles from "./Footer.module.css";

import EngSocLogo from "../../assets/EngSocLogo.png";
import Marker from "../../assets/marker.png";

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
          <div className={styles.paragraph}>
            <p>
              The EngSoc Student Centre is dedicated to providing the best
              possible user experience, so if you have any concerns as a user,
              please feel free to contact us. The EngSoc Student Centre is
              dedicated to providing the best possible user experience, so if
              you have any concerns as a user, please feel free to contact us.
            </p>
          </div>
        </div>
        <div className={styles.links}>
          <p>Quick Links</p>
          <div>
            <a href="">Home</a>
            <a href="">About</a>
            <a href="">Help</a>
          </div>
        </div>
        <div className={styles.contact}>
          <p>Contact Information</p>
          <div className={styles.info}>
            <div className={styles.email}>
              for questions, email: essdev@engsoc.queensu.ca
            </div>
            <div className={styles.location}>
              <div className={styles.pin}>
                <img src={Marker} />
              </div>
              <div className={styles.locationName}>
                <p>Mitchell Hall</p>
                <p>Queen's University, Kingston, ON</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rights}>
        <p>
          @ 2025 Queen’s University Engineering Society Software Development
          Team. All rights reserved.
        </p>
      </div>
    </div>
  );
};
export default Footer;
