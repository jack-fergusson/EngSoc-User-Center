import { Link } from "react-router-dom";
import styles from "./Groups.module.css";
import qscLogo from "../../assets/qsc_logo.png";

const Groups = () => {
  // Mock clubs data - in the future this will come from the backend
  const clubs = [
    {
      id: "qsc",
      name: "Queen's Space Conference",
      description:
        "The Queen's Space conference hosts an annual event where space lovers meet conference-goers.",
      imageInitials: "QSC",
      color: "linear-gradient(135deg, #7d63e0, #b28cff)",
    },
    // Add more clubs here as needed
  ];

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Groups</h2>
      <div className={styles.clubsContainer}>
        {clubs.map((club) => (
          <Link
            key={club.id}
            to={`/club/${club.id}`}
            className={styles.clubCard}
          >
            <div className={styles.clubImageContainer}>
              {club.id === "qsc" ? (
                <img 
                  src={qscLogo} 
                  alt={`${club.name} Logo`} 
                  className={styles.clubImage}
                />
              ) : (
                <div
                  className={styles.clubImage}
                  style={{ background: club.color }}
                >
                  <span className={styles.clubInitials}>{club.imageInitials}</span>
                </div>
              )}
            </div>
            <h3 className={styles.clubName}>{club.name}</h3>
            <p className={styles.clubDescription}>{club.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Groups;
