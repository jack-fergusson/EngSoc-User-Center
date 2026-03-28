import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import goKartImage from "../../assets/goKart.png";
import api from "../../api";

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

  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/authentication/check")
      .then((res) => {
        if (res.data.loggedIn) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

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

  const handleToggleForm = () => setIsFormVisible((prev) => !prev);

  return (
    <div className={styles.pageWrapper}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroWelcome}>
            {user?.username ? `Welcome back, ${user.username}` : "Welcome to EngSoc"}
          </p>
          <h1 className={styles.heroHeading}>
            EngSoc<br />
            <span>Student Centre</span>
          </h1>
          <p className={styles.heroSub}>
            Your central hub for engineering clubs, events, and student life at
            Queen's University.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/groups" className={styles.ctaPrimary}>
              Explore Groups
            </Link>
            <Link to="/calendar" className={styles.ctaSecondary}>
              View Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATFORM HIGHLIGHTS ── */}
      <section className={styles.highlights}>
        <div className={styles.highlightsGrid}>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3>Stay Informed</h3>
            <p>Get the latest announcements and updates from your groups and design teams all in one place.</p>
          </div>

          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3>Design Teams</h3>
            <p>Connect with Queen's top engineering design teams and follow their project updates and milestones.</p>
          </div>

          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Student Groups</h3>
            <p>Discover clubs, join communities, and manage your extra-curricular schedule all in one platform.</p>
          </div>
        </div>
      </section>

      {/* ── DESIGN TEAMS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Design Teams</p>
              <h2 className={styles.sectionTitle}>
                Communicate <span>faster</span>
              </h2>
            </div>
          </div>
          <div className={styles.sectionBody}>
            <img
              src={goKartImage}
              className={styles.sectionImage}
              alt="EngSoc Design Team"
            />
            <div className={styles.postsColumn}>
              <div className={styles.postCard}>
                <p className={styles.postTitle}>QHX — Formula Hybrid Update</p>
                <p className={styles.postText}>
                  The Queen's Human Powered Vehicle team is gearing up for their
                  next competition. Check out their latest build progress.
                </p>
              </div>
              <div className={styles.postCard}>
                <p className={styles.postTitle}>QMIND Showcase Coming Soon</p>
                <p className={styles.postText}>
                  Queen's Machine Intelligence applications are ready to
                  present. Register to attend the spring showcase event.
                </p>
              </div>
              <div className={styles.postCard}>
                <p className={styles.postTitle}>QRET Rocket Launch Recap</p>
                <p className={styles.postText}>
                  Queen's Rocketry &amp; Engineering Team successfully launched
                  at the Spaceport America Cup. Read the full recap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDENT GROUPS ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Student Groups</p>
              <h2 className={styles.sectionTitle}>
                Organize and <span>schedule</span>
              </h2>
            </div>
            <button
              className={styles.createGroupBtn}
              onClick={handleToggleForm}
              type="button"
            >
              + Create a group
            </button>
          </div>

          <div className={styles.sectionBody}>
            <div className={styles.calendarBox}>
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className={styles.calendarBoxTitle}>Calendar</p>
              <p className={styles.calendarBoxSub}>
                Group events and schedules will appear here. Visit the{" "}
                <Link to="/calendar">Calendar page</Link> for the full view.
              </p>
            </div>
            <img
              src="/assets/studentGroupsImg.jpg"
              className={styles.sectionImage}
              alt="Student Groups"
            />
          </div>

          {createdGroups.length > 0 && (
            <div className={styles.createdGroupsContainer}>
              <p className={styles.previewTitle}>Created groups preview</p>
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
                          {group.email && <p className={styles.groupContactLine}>Email: {group.email}</p>}
                          {group.phone && <p className={styles.groupContactLine}>Phone: {group.phone}</p>}
                          {group.address && <p className={styles.groupContactLine}>Address: {group.address}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CREATE GROUP MODAL ── */}
      {isFormVisible && (
        <div className={styles.formOverlay}>
          <form className={styles.groupForm} onSubmit={handleSubmit}>
            <h3>Create a student group</h3>
            <p className={styles.helperText}>
              Add the group's name, description, and contact details. This will
              appear in the Groups directory.
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
              <button type="button" className={styles.cancelBtn} onClick={handleToggleForm}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                Save group
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
