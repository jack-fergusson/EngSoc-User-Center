import styles from "./About.module.css";

const studentsImage = "/images/students.png";

const About = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>


        <h1 className={styles.title}>About Us</h1>




        <div className={styles.featureSection}>
          <div className={styles.featureContent}>
            <h2 className={styles.featureTitle}>
              An all in one stop for your scheduling needs
            </h2>
            <p className={styles.featureDescription}>
              The EngSoc Student Centre helps clubs and organizations communicate 
              and plan events on a centralized platform. The rest of the description 
              should go right here, but I'm a little too lazy right now to write it down, 
              so please replace it with actual useful text that works on the site.
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
            <h2 className={styles.featureTitle}>
              Free, Intuitive, Robust.
            </h2>
            <p className={styles.featureDescription}>
              The EngSoc Student Centre helps clubs and organizations communicate 
              and plan events on a centralized platform. The rest of the description 
              should go right here, but I'm a little too lazy right now to write it down, 
              so please replace it with actual useful text that works on the site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

