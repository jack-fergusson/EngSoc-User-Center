import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* HERO POPUP */}
      <div className={styles.heroPopup}>
        <h1 className={styles.heroTitle}>
          Welcome to the <span>New And Improved</span>
        </h1>
        <h2 className={styles.heroSubtitle}>EngSoc Student Centre</h2>
        <button className={styles.signUpBtn}>Sign Up</button>
      </div>

      {/* NAVBAR BANNER POSTS SECTION */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerCard}>Title:
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
        </div>

        <div className={styles.bannerCard}>Title:
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
        </div>

        <div className={styles.bannerCard}>Title:
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
        </div>
      </section>

      {/* DESIGN TEAMS SECTION */}
      <section className={styles.sectionWrapper}>
        <h2 className={styles.sectionTitle}>
          DESIGN TEAMS: <span>Communicate faster</span>
        </h2>

        <div className={styles.splitContainer}>
          <img
            src="/assets/designTeamsImg.jpg"
            className={styles.sideImage}
            alt="Design Team"
          />

          <div className={styles.postsColumn}>
            <div className={styles.postCard}>
              <p className={styles.postAuthor}>Post Title</p>
              <p className={styles.postText}>
                Lorem ipsum dolor sit amet consectetur adipiscing elit.
              </p>
            </div>

            <div className={styles.postCard}>
              <p className={styles.postAuthor}>Post Title</p>
              <p className={styles.postText}>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            </div>

            <div className={styles.postCard}>
              <p className={styles.postAuthor}>Post Title</p>
              <p className={styles.postText}>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT GROUPS SECTION */}
      <section className={styles.sectionWrapper}>
        <h2 className={styles.sectionTitle}>
          STUDENT GROUPS: <span>Organize and schedule</span>
        </h2>

        <div className={styles.splitContainer}>
          <div className={styles.calendarBox}>
            <p>Calendar Placeholder</p>
          </div>

          <img
            src="/assets/studentGroupsImg.jpg"
            className={styles.sideImage}
            alt="Student Groups"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>
          EngSoc Student Centre – Developed by ESSDev<br />
          © 2025 Queen’s University Engineering Society
        </p>
      </footer>
    </div>
  );
};
// import { useEffect, useState } from "react";
// import api from "../../api";

// const Home = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check login status and fetch user info
//     api
//       .get("/authentication/check")
//       .then((res) => {
//         if (!res.data.loggedIn) {
//           window.location.href = "/login"; // Redirect if not logged in
//         } else {
//           setUser(res.data.user); // Set user data
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching user:", err);
//       });
//   }, []);

//   return (
//     <div>
//       <h1>{user ? `Welcome ${user.username}` : "Loading..."}</h1>
//     </div>
//   );
// };

export default Home;
