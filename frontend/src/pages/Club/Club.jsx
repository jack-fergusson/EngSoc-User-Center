import React from "react";
import { useParams } from "react-router-dom";
import { useClubEvents } from "../../contexts/ClubEventsContext";
import { clubsData } from "../../data/clubsData";
import styles from "./Club.module.css";
import qscLogo from "../../assets/qsc_logo.png";

const Club = () => {
  const { groupId } = useParams();
  const { subscribeToClub, unsubscribeFromClub, isSubscribed, getCreatedClubById, clubEvents } = useClubEvents();

  const createdClub = getCreatedClubById(groupId);
  const contextDetails = clubEvents[groupId]?.details;
  const groupData = createdClub
    ? {
        id: createdClub.id,
        name: contextDetails?.name ?? createdClub.name,
        description: contextDetails?.description ?? createdClub.description,
        contact: {
          email: contextDetails?.contact?.email ?? createdClub.contact?.email ?? "",
          phone: contextDetails?.contact?.phone ?? createdClub.contact?.phone ?? "",
          address: contextDetails?.contact?.address ?? createdClub.contact?.address ?? "",
        },
        contactEmails: contextDetails?.contactEmails ?? createdClub.contactEmails ?? [],
        customContent: contextDetails?.customContent ?? createdClub.customContent ?? "",
        upcomingEvents: (clubEvents[groupId]?.events?.length ? clubEvents[groupId].events : createdClub.upcomingEvents || []).map((e) => ({
          ...e,
          month: e.month || (e.date ? new Date(e.date).toLocaleString("default", { month: "short" }).toUpperCase() : "TBD"),
          day: e.day || (e.date ? String(new Date(e.date).getDate()).padStart(2, "0") : "--"),
        })),
        profileImageUrl: createdClub.profileImageUrl,
      }
    : clubsData[groupId] || clubsData.qsc;

  const isCurrentlySubscribed = isSubscribed(groupData.id);

  const handleSubscribe = () => {
    if (isCurrentlySubscribed) {
      unsubscribeFromClub(groupData.id);
    } else {
      subscribeToClub(groupData.id, groupData.name, groupData.upcomingEvents);
    }
  };

  const getEventColor = (index) => {
    return index === 0 ? "#660099" : "#FF8C42"; // Purple for first, orange for second
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Sidebar Card */}
        <aside className={styles.sidebar}>
          <div className={styles.clubCard}>
            <div className={styles.clubImageContainer}>
              {groupData.profileImageUrl ? (
                <img
                  src={groupData.profileImageUrl}
                  alt={`${groupData.name} Logo`}
                  className={styles.clubImage}
                />
              ) : groupId === "qsc" ? (
                <img
                  src={qscLogo}
                  alt="Queen's Space Conference Logo"
                  className={styles.clubImage}
                />
              ) : (
                <div
                  className={styles.clubImage}
                  style={{
                    background: "linear-gradient(135deg, #7d63e0, #b28cff)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className={styles.clubInitials}>
                    {(groupData.name || "G").slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h2 className={styles.clubName}>{groupData.name}</h2>
            <p className={styles.clubDescription}>{groupData.description}</p>
            <div className={styles.contactSection}>
              <h3 className={styles.contactHeading}>Contact</h3>
              {(groupData.contactEmails && groupData.contactEmails.length > 0) ? (
                groupData.contactEmails.map((em, i) => (
                  <p key={i} className={styles.contactInfo}>{em}</p>
                ))
              ) : (
                <p className={styles.contactInfo}>{groupData.contact.email}</p>
              )}
              <p className={styles.contactInfo}>{groupData.contact.phone}</p>
              <p className={styles.contactInfo}>{groupData.contact.address}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.headerSection}>
            <h1 className={styles.mainTitle}>{groupData.name}</h1>
            <button
              className={styles.subscribeButton}
              onClick={handleSubscribe}
            >
              {isCurrentlySubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>

          {/* Custom Content Section */}
          <section className={styles.customContentSection}>
            <h2 className={styles.sectionTitle}>Custom content</h2>
            <p className={styles.sectionSubtitle}>
              Groups can add photos or text content here!
            </p>
            <div className={styles.customContentBox}>
              <p className={styles.customContentText}>
                {groupData.customContent}
              </p>
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section className={styles.eventsSection}>
            <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            <div className={styles.eventsList}>
              {(groupData.upcomingEvents || []).map((event, index) => (
                <div key={event.id} className={styles.eventCard}>
                  <div
                    className={styles.eventDateBox}
                    style={{ backgroundColor: getEventColor(index) }}
                  >
                    <div className={styles.eventMonth}>{event.month}</div>
                    <div className={styles.eventDay}>{event.day}</div>
                  </div>
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDescription}>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Club;

