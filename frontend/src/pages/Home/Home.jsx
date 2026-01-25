import React, { useState } from "react";
import styles from "./Home.module.css";

const Home = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    initials: "",
    color: "#7d63e0",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }

    const newGroup = {
      id: `${formData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      ...formData,
    };

    setCreatedGroups((prev) => [...prev, newGroup]);
    setFormData({
      name: "",
      description: "",
      initials: "",
      color: "#7d63e0",
      email: "",
      phone: "",
      address: "",
    });
    setIsFormVisible(false);
  };

  const handleToggleForm = () => {
    setIsFormVisible((prev) => !prev);
  };

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
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>
            STUDENT GROUPS: <span>Organize and schedule</span>
          </h2>
          <button
            className={styles.createGroupBtn}
            onClick={handleToggleForm}
            type="button"
          >
            Create a new group
          </button>
        </div>

        <div className={styles.splitContainer}>
          <div className={styles.calendarBox}>
            <p>Calendar Placeholder</p>
            <p className={styles.helperText}>
              Use the button above to add a group with the same name and description that will appear on the Groups page.
            </p>
          </div>

          <img
            src="/assets/studentGroupsImg.jpg"
            className={styles.sideImage}
            alt="Student Groups"
          />
        </div>

        {createdGroups.length > 0 && (
          <div className={styles.createdGroupsContainer}>
            <h3 className={styles.previewTitle}>Created groups preview</h3>
            <div className={styles.previewGrid}>
              {createdGroups.map((group) => (
                <div key={group.id} className={styles.groupCard}>
                  <div
                    className={styles.groupInitials}
                    style={{ background: group.color }}
                  >
                    {group.initials || group.name?.charAt(0) || "G"}
                  </div>
                  <div>
                    <h4 className={styles.groupName}>{group.name}</h4>
                    <p className={styles.groupDescription}>{group.description}</p>
                    {(group.email || group.phone || group.address) && (
                      <div className={styles.groupContact}>
                        {group.email && (
                          <p className={styles.groupContactLine}>Email: {group.email}</p>
                        )}
                        {group.phone && (
                          <p className={styles.groupContactLine}>Phone: {group.phone}</p>
                        )}
                        {group.address && (
                          <p className={styles.groupContactLine}>Address: {group.address}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {isFormVisible && (
        <div className={styles.formOverlay}>
          <form className={styles.groupForm} onSubmit={handleSubmit}>
            <h3>Create a student group</h3>
            <p className={styles.helperText}>
              Match the fields from the Groups page and add contact info (email, phone, address) that will be surfaced for members.
            </p>

            <label className={styles.formField}>
              <span>Name</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Queen's Robotics Club"
                className={styles.formInput}
                required
              />
            </label>

            <label className={styles.formField}>
              <span>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what the group does, where events happen, and what members can expect."
                className={styles.formTextarea}
                required
              />
            </label>

            <label className={styles.formField}>
              <span>Image initials</span>
              <input
                name="initials"
                value={formData.initials}
                onChange={handleInputChange}
                placeholder="QRC"
                className={styles.formInput}
              />
            </label>

            <label className={styles.formField}>
              <span>Accent color</span>
              <input
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                type="color"
                className={styles.colorInput}
              />
            </label>

            <label className={styles.formField}>
              <span>Email</span>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@group.ca"
                className={styles.formInput}
                type="email"
              />
            </label>

            <label className={styles.formField}>
              <span>Phone</span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(613) 555-0101"
                className={styles.formInput}
              />
            </label>

            <label className={styles.formField}>
              <span>Address</span>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main St, Kingston, ON"
                className={styles.formInput}
              />
            </label>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleToggleForm}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                Save group
              </button>
            </div>
          </form>
        </div>
      )}
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
