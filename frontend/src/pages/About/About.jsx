import styles from "./About.module.css";

const studentsImage = "/images/students.png";

const About = () => {
  return (
    <div className={styles.container}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOrb} aria-hidden="true" />
        <p className={styles.heroLabel}>Who we are</p>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.heroSub}>
          Built by students, for students — the EngSoc Student Centre is the
          central hub for engineering life at Queen's University.
        </p>
      </section>

      {/* Features */}
      <div className={styles.content}>

        <div className={styles.featureSection}>
          <div className={styles.featureContent}>
            <p className={styles.featureLabel}>All-in-one platform</p>
            <h2 className={styles.featureTitle}>
              An all-in-one stop for your scheduling needs
            </h2>
            <p className={styles.featureDescription}>
              The EngSoc Student Centre helps engineering clubs and design teams
              communicate and coordinate on a single, centralized platform.
              From announcing upcoming events to managing group members, every
              tool you need is right here — no more scattered group chats or
              missed emails.
            </p>
          </div>
          <div className={styles.featureImage}>
            <img
              src={studentsImage}
              alt="Students at Queen's University"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.featureSection}>
          <div className={styles.featureImage}>
            <img
              src={studentsImage}
              alt="Students at Queen's University"
              className={styles.image}
            />
          </div>
          <div className={styles.featureContent}>
            <p className={styles.featureLabel}>Free &amp; open</p>
            <h2 className={styles.featureTitle}>
              Free, intuitive, robust.
            </h2>
            <p className={styles.featureDescription}>
              Designed and maintained by ESSDev — the Queen's Engineering
              Society Software Development Team — this platform is entirely
              free for all engineering students. We keep it simple and fast so
              you can focus on what matters: building great teams and
              unforgettable experiences.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
