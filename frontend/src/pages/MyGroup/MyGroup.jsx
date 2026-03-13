import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useClubEvents } from "../../contexts/ClubEventsContext";
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
    deleteClub,
  } = useClubEvents();
  const [user, setUser] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [groupEvents, setGroupEvents] = useState([]);
  const [eventRefresh, setEventRefresh] = useState(0);
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [eventSaved, setEventSaved] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    category: "Event",
    description: "",
    price: "",
    signupLink: "",
  });

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

  useEffect(() => {
    if (!selectedGroupId) { setGroupEvents([]); return; }
    let mounted = true;
    api
      .get("/event/events", { params: { clubId: selectedGroupId } })
      .then((res) => { if (mounted) setGroupEvents(res.data); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [selectedGroupId, eventRefresh]);

  const manageableGroups = getClubsManageableByUser(user?.email);

  // ── Edit-view data ────────────────────────────────────────────────────────
  const selectedGroup = selectedGroupId ? getCreatedClubById(selectedGroupId) : null;
  const managedClub = selectedGroupId ? clubEvents[selectedGroupId] : null;

  const baseGroup = useMemo(() => {
    if (selectedGroup) {
      return {
        name: selectedGroup.name,
        description: selectedGroup.description,
        customContent: selectedGroup.customContent,
        contact: selectedGroup.contact || {},
        upcomingEvents: selectedGroup.upcomingEvents || [],
      };
    }
    return { name: "", description: "", customContent: "", contact: {}, upcomingEvents: [] };
  }, [selectedGroup]);

  const detailsFromContext = useMemo(
    () =>
      managedClub?.details || {
        name: baseGroup.name,
        description: baseGroup.description,
        customContent: baseGroup.customContent,
        contact: baseGroup.contact,
        contactEmails: selectedGroup?.contactEmails || [],
      },
    [managedClub?.details, baseGroup, selectedGroup?.contactEmails]
  );

  const [detailsForm, setDetailsForm] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    customContent: "",
    contactEmails: [],
  });

  useEffect(() => {
    if (!selectedGroupId) return;
    setDetailsForm({
      name: detailsFromContext.name,
      description: detailsFromContext.description,
      customContent: detailsFromContext.customContent,
      contactEmail: detailsFromContext.contact?.email || "",
      contactPhone: detailsFromContext.contact?.phone || "",
      contactAddress: detailsFromContext.contact?.address || "",
      contactEmails: Array.isArray(detailsFromContext.contactEmails)
        ? [...detailsFromContext.contactEmails]
        : [],
    });
  }, [selectedGroupId, detailsFromContext]);

  const displayedEvents = useMemo(() => {
    return groupEvents.map((event) => ({ ...event, ...formatMonthDay(event.date) }));
  }, [groupEvents]);

  const handleDetailChange = (field) => (e) => {
    setDetailsForm((prev) => ({ ...prev, [field]: e.target.value }));
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
    if (!selectedGroupId) return;
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
      contactEmails,
    };
    updateClubDetails(selectedGroupId, details);
    updateCreatedClub(selectedGroupId, {
      name: detailsForm.name,
      description: detailsForm.description,
      customContent: detailsForm.customContent,
      contact: details.contact,
      contactEmails,
    });
    setStatusMessage("Group details updated.");
    setSavingDetails(false);
    setDetailsSaved(true);
    window.setTimeout(() => {
      setStatusMessage("");
      setDetailsSaved(false);
    }, 2000);
  };

  const handleAddEvent = () => {
    if (!selectedGroupId) return;
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
    addEventToClub(selectedGroupId, detailsForm.name, eventToAdd);
    setNewEvent({ title: "", date: "", category: "Event", description: "", price: "", signupLink: "" });
    setEventRefresh((n) => n + 1);
    setStatusMessage("Event added to your calendar.");
    setEventSaved(true);
    window.setTimeout(() => {
      setStatusMessage("");
      setEventSaved(false);
    }, 2000);
  };

  // ── List view ─────────────────────────────────────────────────────────────
  if (!selectedGroupId) {
    return (
      <div className={styles.page}>
        <header className={styles.listHeader}>
          <p className={styles.subTitle}>Admin</p>
          <h1 className={styles.title}>My Groups</h1>
          <p className={styles.overview}>
            {user
              ? `Logged in as ${user.username || user.email}`
              : "Loading…"}
          </p>
        </header>

        {manageableGroups.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You don't manage any groups yet.</p>
            <p className={styles.note}>
              Create a group from the Groups page and add your email as a contact.
            </p>
          </div>
        ) : (
          <div className={styles.groupList}>
            {manageableGroups.map((group) => (
              <button
                key={group.id}
                className={styles.groupListCard}
                onClick={() => setSelectedGroupId(group.id)}
              >
                <div className={styles.groupListImage}>
                  {group.profileImageUrl ? (
                    <img src={group.profileImageUrl} alt={`${group.name} logo`} />
                  ) : (
                    <span>{(group.name || "G").slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className={styles.groupListInfo}>
                  <h3 className={styles.groupListName}>{group.name}</h3>
                  <p className={styles.groupListDesc}>{group.description}</p>
                </div>
                <span className={styles.groupListArrow}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Edit view ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => {
              setSelectedGroupId(null);
              setStatusMessage("");
            }}
          >
            ← My Groups
          </button>
          <p className={styles.subTitle}>My Group</p>
          <h1 className={styles.title}>{detailsForm.name}</h1>
          <p className={styles.overview}>
            {user
              ? `${user.username || user.email} manages this group.`
              : "Log in to personalize your group."}
          </p>
          <div className={styles.status}>{statusMessage}</div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Group Details</h2>
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
          className={`${styles.primaryButton} ${detailsSaved ? styles.savedButton : ""}`}
          onClick={handleSaveDetails}
          disabled={savingDetails || detailsSaved}
        >
          {detailsSaved ? "✓ Saved!" : "Save group details"}
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
          <button
            className={`${styles.secondaryButton} ${eventSaved ? styles.savedButton : ""}`}
            onClick={handleAddEvent}
            disabled={eventSaved}
          >
            {eventSaved ? "✓ Added!" : "Add event to calendar"}
          </button>
        </div>
      </section>

      <section className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>Danger zone</h2>
        <p className={styles.dangerDesc}>
          Permanently delete this group and all its events. This cannot be undone.
        </p>
        <button
          className={styles.deleteButton}
          onClick={() => {
            if (window.confirm(`Delete "${detailsForm.name}"? This cannot be undone.`)) {
              deleteClub(selectedGroupId);
              setSelectedGroupId(null);
            }
          }}
        >
          Delete group
        </button>
      </section>
    </div>
  );
};

export default MyGroup;
