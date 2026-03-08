import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useClubEvents } from "../../contexts/ClubEventsContext";
import { clubsData } from "../../data/clubsData";
import styles from "./MyGroup.module.css";
import qscLogo from "../../assets/qsc_logo.png";

const formatMonthDay = (dateString) => {
  if (!dateString) return { month: "TBD", day: "--" };
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return { month: "TBD", day: "--" };
  }
  return {
    month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    day: String(date.getDate()).padStart(2, "0"),
  };
};

const MyGroup = () => {
  const {
    clubEvents,
    addEventToClub,
    updateClubDetails,
    getClubsManageableByUser,
    getCreatedClubById,
    updateCreatedClub,
  } = useClubEvents();
  const [user, setUser] = useState(null);
  const manageableClubs = getClubsManageableByUser(user?.email);
  const clubsFromData = Object.keys(clubsData).map((id) => ({ id, ...clubsData[id] }));
  const availableClubs = [...manageableClubs, ...clubsFromData];
  const defaultClubId = availableClubs[0]?.id;
  const [selectedClubId, setSelectedClubId] = useState(() => {
    return localStorage.getItem("userClubId") || defaultClubId || "";
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    category: "Event",
    description: "",
    price: "",
    signupLink: "",
  });

  useEffect(() => {
    if (defaultClubId && !availableClubs.find((c) => c.id === selectedClubId)) {
      setSelectedClubId(defaultClubId);
    }
  }, [defaultClubId, availableClubs, selectedClubId]);

  useEffect(() => {
    if (selectedClubId) localStorage.setItem("userClubId", selectedClubId);
  }, [selectedClubId]);

  useEffect(() => {
    let mounted = true;
    api
      .get("/authentication/check")
      .then((res) => {
        if (mounted && res.data.loggedIn) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedClub = getCreatedClubById(selectedClubId) || clubsData[selectedClubId];
  const isCreatedClub = !!getCreatedClubById(selectedClubId);
  const baseClub = useMemo(() => {
    if (selectedClub) {
      return {
        name: selectedClub.name,
        description: selectedClub.description,
        customContent: selectedClub.customContent,
        contact: selectedClub.contact || {},
        upcomingEvents: selectedClub.upcomingEvents || [],
      };
    }
    return { name: "", description: "", customContent: "", contact: {}, upcomingEvents: [] };
  }, [selectedClub]);
  const managedClub = clubEvents[selectedClubId];
  const detailsFromContext = useMemo(
    () =>
      managedClub?.details || {
        name: baseClub.name,
        description: baseClub.description,
        customContent: baseClub.customContent,
        contact: baseClub.contact,
        contactEmails: selectedClub?.contactEmails || [],
      },
    [managedClub?.details, baseClub, selectedClub?.contactEmails]
  );

  const [detailsForm, setDetailsForm] = useState({
    name: detailsFromContext.name,
    description: detailsFromContext.description,
    contactEmail: detailsFromContext.contact?.email || "",
    contactPhone: detailsFromContext.contact?.phone || "",
    contactAddress: detailsFromContext.contact?.address || "",
    customContent: detailsFromContext.customContent,
    contactEmails: Array.isArray(detailsFromContext.contactEmails) ? [...detailsFromContext.contactEmails] : [],
  });

  useEffect(() => {
    const nextDetails = {
      name: detailsFromContext.name,
      description: detailsFromContext.description,
      customContent: detailsFromContext.customContent,
      contactEmail: detailsFromContext.contact?.email || "",
      contactPhone: detailsFromContext.contact?.phone || "",
      contactAddress: detailsFromContext.contact?.address || "",
      contactEmails: Array.isArray(detailsFromContext.contactEmails) ? [...detailsFromContext.contactEmails] : [],
    };
    setDetailsForm(nextDetails);
  }, [selectedClubId, detailsFromContext]);

  const displayedEvents = useMemo(() => {
    const fromContext = managedClub?.events;
    if (fromContext && fromContext.length > 0) {
      return fromContext.map((event) => event);
    }
    return (baseClub.upcomingEvents || []).map((event) => ({
      ...event,
      ...formatMonthDay(event.date),
    }));
  }, [managedClub?.events, baseClub.upcomingEvents]);

  const handleDetailChange = (field) => (event) => {
    setDetailsForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleContactEmailChange = (index, value) => {
    setDetailsForm((prev) => {
      const next = [...(prev.contactEmails || [])];
      next[index] = value;
      return { ...prev, contactEmails: next };
    });
  };

  const addContactEmail = () => {
    setDetailsForm((prev) => ({
      ...prev,
      contactEmails: [...(prev.contactEmails || []), ""],
    }));
  };

  const removeContactEmail = (index) => {
    setDetailsForm((prev) => ({
      ...prev,
      contactEmails: (prev.contactEmails || []).filter((_, i) => i !== index),
    }));
  };

  const handleSaveDetails = () => {
    if (!selectedClubId) return;
    setSavingDetails(true);
    const contactEmails = (detailsForm.contactEmails || [])
      .map((e) => (typeof e === "string" ? e.trim() : ""))
      .filter(Boolean);
    const details = {
      name: detailsForm.name,
      description: detailsForm.description,
      customContent: detailsForm.customContent,
      contact: {
        email: detailsForm.contactEmail,
        phone: detailsForm.contactPhone,
        address: detailsForm.contactAddress,
      },
      ...(isCreatedClub && { contactEmails }),
    };
    updateClubDetails(selectedClubId, details);
    if (isCreatedClub) {
      updateCreatedClub(selectedClubId, {
        name: detailsForm.name,
        description: detailsForm.description,
        customContent: detailsForm.customContent,
        contact: details.contact,
        contactEmails,
      });
    }
    setStatusMessage("Group details updated.");
    setSavingDetails(false);
    window.setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleAddEvent = () => {
    if (!selectedClubId) return;
    if (!newEvent.title || !newEvent.date) {
      setStatusMessage("Title and date are required for every event.");
      window.setTimeout(() => setStatusMessage(""), 3000);
      return;
    }
    const { month, day } = formatMonthDay(newEvent.date);
    const eventToAdd = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      month,
      day,
      description: newEvent.description,
      category: newEvent.category,
      price: newEvent.price ? parseFloat(newEvent.price) : 0,
      signupLink: newEvent.signupLink,
    };
    addEventToClub(selectedClubId, detailsForm.name, eventToAdd);
    setNewEvent({
      title: "",
      date: "",
      category: "Event",
      description: "",
      price: "",
      signupLink: "",
    });
    setStatusMessage("Event added to your calendar.");
    window.setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.subTitle}>My Group</p>
          <h1 className={styles.title}>{detailsForm.name}</h1>
          <p className={styles.overview}>
            {user
              ? `${user.username || user.email} manages this group.`
              : "Log in to personalize your group."}
          </p>
          <p className={styles.note}>
            This page shows edits for {detailsForm.name}. Choose a different group if
            you manage multiple communities.
          </p>
          <div className={styles.status}>{statusMessage}</div>
        </div>
        <div className={styles.previewCard}>
          <div className={styles.imageFrame}>
            {selectedClub?.profileImageUrl ? (
              <img src={selectedClub.profileImageUrl} alt="Club logo" />
            ) : (
              <img src={qscLogo} alt="Club logo" />
            )}
          </div>
          <div>
            <h3 className={styles.previewTitle}>Contact</h3>
            {detailsForm.contactEmails?.length > 0 ? (
              detailsForm.contactEmails.filter(Boolean).map((em, i) => (
                <p key={i}>{em}</p>
              ))
            ) : (
              <p>{detailsForm.contactEmail || "—"}</p>
            )}
            <p>{detailsForm.contactPhone}</p>
            <p>{detailsForm.contactAddress}</p>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Group Details</h2>
          <select
            value={selectedClubId}
            onChange={(e) => setSelectedClubId(e.target.value)}
          >
            {availableClubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGrid}>
          <label>
            Group name
            <input
              value={detailsForm.name}
              onChange={handleDetailChange("name")}
            />
          </label>
          <label>
            Description
            <textarea
              rows="3"
              value={detailsForm.description}
              onChange={handleDetailChange("description")}
            />
          </label>
          {isCreatedClub ? (
            <label className={styles.fullWidth}>
              Contact emails (people who can edit this group)
              {((detailsForm.contactEmails?.length && detailsForm.contactEmails) ? detailsForm.contactEmails : [""]).map((email, index) => (
                <div key={index} className={styles.contactEmailRow}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleContactEmailChange(index, e.target.value)}
                    placeholder="email@example.com"
                  />
                  <button
                    type="button"
                    className={styles.removeEmailButton}
                    onClick={() => removeContactEmail(index)}
                    aria-label="Remove email"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addEmailButton}
                onClick={addContactEmail}
              >
                Add another contact email
              </button>
            </label>
          ) : (
            <label>
              Contact email
              <input
                type="email"
                value={detailsForm.contactEmail}
                onChange={handleDetailChange("contactEmail")}
              />
            </label>
          )}
          <label>
            Contact phone
            <input
              value={detailsForm.contactPhone}
              onChange={handleDetailChange("contactPhone")}
            />
          </label>
          <label>
            Contact address
            <input
              value={detailsForm.contactAddress}
              onChange={handleDetailChange("contactAddress")}
            />
          </label>
          <label className={styles.fullWidth}>
            Custom content
            <textarea
              rows="4"
              value={detailsForm.customContent}
              onChange={handleDetailChange("customContent")}
            />
          </label>
        </div>
        <button
          className={styles.primaryButton}
          onClick={handleSaveDetails}
          disabled={savingDetails}
        >
          Save group details
        </button>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Upcoming events</h2>
          <p className={styles.sectionSubtitle}>
            Events you add here will automatically surface on the shared calendar.
          </p>
        </div>
        <div className={styles.eventsContainer}>
          {displayedEvents.map((event) => (
            <article key={`${event.id}-${event.title}`} className={styles.eventCard}>
              <div className={styles.eventDate}>
                <span>{event.month}</span>
                <strong>{event.day}</strong>
              </div>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p className={styles.meta}>
                  {event.category} • ${event.price || 0}
                </p>
                {event.signupLink && (
                  <a href={event.signupLink} target="_blank" rel="noreferrer">
                    Add to RSVP
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className={styles.eventForm}>
          <h3>Add a new event</h3>
          <div className={styles.formGrid}>
            <label>
              Title
              <input
                value={newEvent.title}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
              />
            </label>
            <label>
              Category
              <input
                value={newEvent.category}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, category: e.target.value }))}
              />
            </label>
            <label>
              Price
              <input
                type="number"
                value={newEvent.price}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, price: e.target.value }))}
              />
            </label>
            <label>
              Signup link
              <input
                type="url"
                value={newEvent.signupLink}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, signupLink: e.target.value }))
                }
              />
            </label>
            <label className={styles.fullWidth}>
              Description
              <textarea
                rows="3"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </label>
          </div>
          <button className={styles.secondaryButton} onClick={handleAddEvent}>
            Add event to calendar
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyGroup;
