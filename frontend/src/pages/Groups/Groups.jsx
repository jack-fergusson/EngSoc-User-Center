import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useClubEvents } from "../../contexts/ClubEventsContext";
import { clubsData } from "../../data/clubsData";
import styles from "./Groups.module.css";
import qscLogo from "../../assets/qsc_logo.png";

const FILTER_ALL = "all";
const FILTER_SUBSCRIBED = "subscribed";

const MAX_IMAGE_SIZE = 400;
const ACCEPT_IMAGE = "image/jpeg,image/png,image/gif,image/webp";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageIfNeeded(dataUrl, maxSize = MAX_IMAGE_SIZE) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxSize && height <= maxSize) {
        resolve(dataUrl);
        return;
      }
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

const normalizeClubForCard = (club) => {
  if (club.profileImageUrl) {
    return { ...club, imageInitials: (club.name || "C").slice(0, 2).toUpperCase(), color: null };
  }
  const initials = (club.name || "Club").slice(0, 3).toUpperCase();
  return {
    ...club,
    imageInitials: initials,
    color: "linear-gradient(135deg, #7d63e0, #b28cff)",
  };
};

const Groups = () => {
  const { addClub, isSubscribed } = useClubEvents();
  const [clubs, setClubs] = useState([]);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    profileImageUrl: "",
    contactEmails: [""],
    contactPhone: "",
    contactAddress: "",
    customContent: "",
  });
  const [dragOver, setDragOver] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/authentication/check")
      .then((res) => {
        if (mounted && res.data.loggedIn && res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .get("/event/clubs")
      .then((res) => {
        if (mounted) setClubs(res.data);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const allClubs = useMemo(() => {
    const fromData = Object.values(clubsData).map((c) => ({ ...c, isCreated: false }));
    const fromDb = clubs.map((c) => ({
      id: c._id ?? c.id,
      name: c.name,
      description: c.description,
      profileImageUrl: c.profileImageUrl,
      contact: c.contact,
      contactEmails: c.contactEmails,
      customContent: c.customContent,
      upcomingEvents: c.upcomingEvents || [],
      createdBy: c.createdBy,
      imageInitials: (c.name || "C").slice(0, 2).toUpperCase(),
      color: "linear-gradient(135deg, #7d63e0, #b28cff)",
      isCreated: true,
    }));
    return [...fromData, ...fromDb];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    if (filter === FILTER_SUBSCRIBED) {
      return allClubs.filter((club) => isSubscribed(club.id));
    }
    return allClubs;
  }, [allClubs, filter, isSubscribed]);

  const handleOpenAdd = () => {
    setForm({
      name: "",
      description: "",
      profileImageUrl: "",
      contactEmails: [""],
      contactPhone: "",
      contactAddress: "",
      customContent: "",
    });
    setShowAddModal(true);
  };

  const handleCloseAdd = () => setShowAddModal(false);

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleContactEmailChange = (index, value) => {
    setForm((prev) => {
      const next = [...(prev.contactEmails || [""])];
      next[index] = value;
      return { ...prev, contactEmails: next };
    });
  };

  const addContactEmail = () => {
    setForm((prev) => ({ ...prev, contactEmails: [...(prev.contactEmails || [""]), ""] }));
  };

  const removeContactEmail = (index) => {
    setForm((prev) => {
      const next = (prev.contactEmails || [""]).filter((_, i) => i !== index);
      return { ...prev, contactEmails: next.length > 0 ? next : [""] };
    });
  };

  const processImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploadingImage(true);
    try {
      let dataUrl = await readFileAsDataUrl(file);
      dataUrl = await resizeImageIfNeeded(dataUrl);
      setForm((prev) => ({ ...prev, profileImageUrl: dataUrl }));
    } catch {
      setForm((prev) => ({ ...prev, profileImageUrl: "" }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    processImageFile(file);
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
    e.target.value = "";
  };

  const clearProfileImage = () => {
    setForm((prev) => ({ ...prev, profileImageUrl: "" }));
  };

  const handleCreateClub = async () => {
    if (!form.name.trim()) return;
    const createdBy = user?.email ?? user?.id ?? "anonymous";
    const contactEmails = (form.contactEmails || [""])
      .map((e) => e.trim())
      .filter(Boolean);
    const club = await addClub(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        profileImageUrl: form.profileImageUrl.trim() || null,
        contactEmails,
        contactPhone: form.contactPhone.trim(),
        contactAddress: form.contactAddress.trim(),
        customContent: form.customContent.trim(),
      },
      createdBy
    );
    if (club) setClubs((prev) => [...prev, club]);
    handleCloseAdd();
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>Groups</h2>
        <div className={styles.actions}>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value={FILTER_ALL}>All groups</option>
            <option value={FILTER_SUBSCRIBED}>My subscriptions</option>
          </select>
          <button type="button" className={styles.addButton} onClick={handleOpenAdd}>
            Add group
          </button>
        </div>
      </div>

      <div className={styles.clubsContainer}>
        {filteredClubs.map((club) => {
          const card = normalizeClubForCard(club);
          return (
            <Link
              key={club.id}
              to={`/group/${club.id}`}
              className={styles.clubCard}
            >
              <div className={styles.clubImageContainer}>
                {card.profileImageUrl ? (
                  <img
                    src={card.profileImageUrl}
                    alt={`${club.name} Logo`}
                    className={styles.clubImage}
                  />
                ) : club.id === "qsc" ? (
                  <img
                    src={qscLogo}
                    alt={`${club.name} Logo`}
                    className={styles.clubImage}
                  />
                ) : (
                  <div
                    className={styles.clubImage}
                    style={{ background: card.color }}
                  >
                    <span className={styles.clubInitials}>{card.imageInitials}</span>
                  </div>
                )}
              </div>
              <h3 className={styles.clubName}>{club.name}</h3>
              <p className={styles.clubDescription}>{club.description}</p>
            </Link>
          );
        })}
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleCloseAdd}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create a group</h3>
            <div className={styles.modalForm}>
              <label>
                Title
                <input
                  value={form.name}
                  onChange={handleFormChange("name")}
                  placeholder="Group name"
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange("description")}
                  placeholder="Short description"
                />
              </label>
              <label className={styles.fullWidth}>
                Profile picture
                <div
                  className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""} ${form.profileImageUrl ? styles.dropZoneHasImage : ""}`}
                  onDrop={handleImageDrop}
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_IMAGE}
                    onChange={handleImageSelect}
                    className={styles.dropZoneInput}
                    id="group-profile-upload"
                  />
                  {form.profileImageUrl ? (
                    <div
                      className={styles.dropZonePreview}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    >
                      <img src={form.profileImageUrl} alt="Preview" />
                      <div className={styles.dropZoneOverlay}>
                        <span>Drop new image or click to replace</span>
                        <button
                          type="button"
                          className={styles.dropZoneRemove}
                          onClick={(e) => {
                            e.stopPropagation();
                            clearProfileImage();
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="group-profile-upload" className={styles.dropZoneLabel}>
                      {uploadingImage ? (
                        <span>Processing…</span>
                      ) : (
                        <>
                          <span className={styles.dropZoneIcon}>📷</span>
                          <span>Drag and drop an image here, or click to upload</span>
                          <span className={styles.dropZoneHint}>JPEG, PNG, GIF or WebP</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </label>
              <label className={styles.fullWidth}>
                Contact emails (these people can edit the group on My Group)
                {(form.contactEmails || [""]).map((email, index) => (
                  <div key={index} className={styles.contactEmailRow}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleContactEmailChange(index, e.target.value)}
                      placeholder="email@example.com"
                    />
                    {(form.contactEmails?.length ?? 1) > 1 ? (
                      <button
                        type="button"
                        className={styles.removeEmailButton}
                        onClick={() => removeContactEmail(index)}
                        aria-label="Remove email"
                      >
                        Remove
                      </button>
                    ) : null}
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
                  value={form.contactPhone}
                  onChange={handleFormChange("contactPhone")}
                  placeholder="Phone number"
                />
              </label>
              <label>
                Contact address
                <input
                  value={form.contactAddress}
                  onChange={handleFormChange("contactAddress")}
                  placeholder="Address"
                />
              </label>
              <label className={styles.fullWidth}>
                Content
                <textarea
                  rows={4}
                  value={form.customContent}
                  onChange={handleFormChange("customContent")}
                  placeholder="Custom content for your group"
                />
              </label>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelButton} onClick={handleCloseAdd}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.createButton}
                onClick={handleCreateClub}
                disabled={!form.name.trim()}
              >
                Create group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
