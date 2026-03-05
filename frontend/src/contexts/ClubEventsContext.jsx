import { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEYS = {
  subscribedClubs: "engsoc_subscribed_clubs",
  clubEvents: "engsoc_club_events",
  createdClubs: "engsoc_created_clubs",
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
};

const ClubEventsContext = createContext();

export const useClubEvents = () => {
  const context = useContext(ClubEventsContext);
  if (!context) {
    throw new Error("useClubEvents must be used within ClubEventsProvider");
  }
  return context;
};

export const ClubEventsProvider = ({ children }) => {
  const [subscribedClubs, setSubscribedClubs] = useState(() =>
    loadFromStorage(STORAGE_KEYS.subscribedClubs, [])
  );
  const [clubEvents, setClubEvents] = useState(() =>
    loadFromStorage(STORAGE_KEYS.clubEvents, {})
  );
  const [createdClubs, setCreatedClubs] = useState(() =>
    loadFromStorage(STORAGE_KEYS.createdClubs, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.subscribedClubs, subscribedClubs);
  }, [subscribedClubs]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.clubEvents, clubEvents);
  }, [clubEvents]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.createdClubs, createdClubs);
  }, [createdClubs]);

  const subscribeToClub = useCallback((clubId, clubName, events) => {
    setSubscribedClubs((prev) => (prev.includes(clubId) ? prev : [...prev, clubId]));
    setClubEvents((prev) => {
      if (!prev[clubId]) {
        return {
          ...prev,
          [clubId]: {
            clubName,
            events: events || [],
          },
        };
      }
      return prev;
    });
  }, []);

  const unsubscribeFromClub = useCallback((clubId) => {
    setSubscribedClubs((prev) => prev.filter((id) => id !== clubId));
    setClubEvents((prev) => {
      const newEvents = { ...prev };
      delete newEvents[clubId];
      return newEvents;
    });
  }, []);

  const getAllSubscribedEvents = useCallback(() => {
    const allEvents = [];
    Object.values(clubEvents).forEach((clubData) => {
      clubData.events.forEach((event) => {
        allEvents.push({
          ...event,
          group: clubData.clubName,
        });
      });
    });
    return allEvents;
  }, [clubEvents]);

  const setClubEventsForClub = useCallback((clubId, clubName, events = [], details = {}) => {
    setSubscribedClubs((prev) => (prev.includes(clubId) ? prev : [...prev, clubId]));
    setClubEvents((prev) => ({
      ...prev,
      [clubId]: {
        clubName,
        events: events.map((event) => ({ ...event })),
        details,
      },
    }));
  }, []);

  const addEventToClub = useCallback((clubId, clubName, event) => {
    setSubscribedClubs((prev) => (prev.includes(clubId) ? prev : [...prev, clubId]));
    setClubEvents((prev) => {
      const existing = prev[clubId] || { clubName, events: [], details: {} };
      return {
        ...prev,
        [clubId]: {
          clubName: clubName || existing.clubName,
          events: [...existing.events, { ...event }],
          details: existing.details,
        },
      };
    });
  }, []);

  const updateClubDetails = useCallback((clubId, details) => {
    setClubEvents((prev) => {
      const existing = prev[clubId] || { clubName: details.name || "My Club", events: [], details: {} };
      return {
        ...prev,
        [clubId]: {
          ...existing,
          clubName: details.name || existing.clubName,
          details,
        },
      };
    });
  }, []);

  const isSubscribed = useCallback(
    (clubId) => {
      return subscribedClubs.includes(clubId);
    },
    [subscribedClubs]
  );

  const addClub = useCallback((clubData, createdBy) => {
    const id = `created-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const contactEmails = Array.isArray(clubData.contactEmails)
      ? clubData.contactEmails.filter((e) => e && String(e).trim()).map((e) => String(e).trim().toLowerCase())
      : [];
    const club = {
      id,
      name: clubData.name || "Untitled Club",
      description: clubData.description || "",
      profileImageUrl: clubData.profileImageUrl || null,
      contact: {
        email: contactEmails[0] || clubData.contactEmail || "",
        phone: clubData.contactPhone || "",
        address: clubData.contactAddress || "",
      },
      contactEmails: contactEmails.length > 0 ? contactEmails : (clubData.contactEmail ? [String(clubData.contactEmail).trim().toLowerCase()] : []),
      customContent: clubData.customContent || "",
      upcomingEvents: [],
      createdBy: createdBy ? String(createdBy).trim().toLowerCase() : null,
    };
    setCreatedClubs((prev) => [...prev, club]);
    return club;
  }, []);

  const getClubsManageableByUser = useCallback(
    (userEmail) => {
      if (!userEmail) return [];
      const email = String(userEmail).trim().toLowerCase();
      return createdClubs.filter(
        (c) =>
          c.createdBy === email ||
          (Array.isArray(c.contactEmails) && c.contactEmails.includes(email))
      );
    },
    [createdClubs]
  );

  const getClubsCreatedByUser = useCallback(
    (userId) => {
      if (!userId) return [];
      const id = String(userId).trim().toLowerCase();
      return createdClubs.filter((c) => c.createdBy === id);
    },
    [createdClubs]
  );

  const updateCreatedClub = useCallback((clubId, updates) => {
    setCreatedClubs((prev) =>
      prev.map((c) =>
        c.id === clubId
          ? {
              ...c,
              ...(updates.name !== undefined && { name: updates.name }),
              ...(updates.description !== undefined && { description: updates.description }),
              ...(updates.customContent !== undefined && { customContent: updates.customContent }),
              ...(updates.profileImageUrl !== undefined && { profileImageUrl: updates.profileImageUrl }),
              ...(updates.contact !== undefined && { contact: { ...c.contact, ...updates.contact } }),
              ...(Array.isArray(updates.contactEmails) && { contactEmails: updates.contactEmails.map((e) => String(e).trim().toLowerCase()).filter(Boolean) }),
            }
          : c
      )
    );
  }, []);

  const getCreatedClubById = useCallback(
    (clubId) => createdClubs.find((c) => c.id === clubId) || null,
    [createdClubs]
  );

  return (
    <ClubEventsContext.Provider
      value={{
        subscribedClubs,
        clubEvents,
        createdClubs,
        subscribeToClub,
        unsubscribeFromClub,
        getAllSubscribedEvents,
        setClubEventsForClub,
        addEventToClub,
        updateClubDetails,
        isSubscribed,
        addClub,
        getClubsManageableByUser,
        getClubsCreatedByUser,
        getCreatedClubById,
        updateCreatedClub,
      }}
    >
      {children}
    </ClubEventsContext.Provider>
  );
};
