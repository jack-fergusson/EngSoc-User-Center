import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api";

const ClubEventsContext = createContext();

export const useClubEvents = () => {
  const context = useContext(ClubEventsContext);
  if (!context) {
    throw new Error("useClubEvents must be used within ClubEventsProvider");
  }
  return context;
};

const toClub = (raw) => ({ ...raw, id: raw._id?.toString() ?? raw.id });

export const ClubEventsProvider = ({ children }) => {
  const [subscribedClubs, setSubscribedClubs] = useState([]);
  const [clubEvents, setClubEvents] = useState({});
  const [createdClubs, setCreatedClubs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load all data on mount
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // Fetch current user
      let user = null;
      try {
        const res = await api.get("/authentication/check");
        if (res.data.loggedIn) user = res.data.user;
      } catch {}
      if (!mounted) return;
      setCurrentUser(user);

      // Fetch all clubs
      let clubs = [];
      try {
        const res = await api.get("/event/clubs");
        clubs = res.data.map(toClub);
      } catch {}
      if (!mounted) return;
      setCreatedClubs(clubs);

      if (!user?.email) return;

      // Fetch subscriptions for this user
      let subs = [];
      try {
        const res = await api.get("/event/subscriptions", { params: { userId: user.email } });
        subs = res.data;
      } catch {}
      if (!mounted) return;

      const subscribedIds = subs.map((s) => s.clubId);
      setSubscribedClubs(subscribedIds);

      // Build clubEvents map from subscribed clubs
      const eventsMap = {};
      for (const sub of subs) {
        const club = clubs.find((c) => c.id === sub.clubId);
        if (club) {
          eventsMap[sub.clubId] = {
            clubName: club.name,
            events: club.upcomingEvents || [],
            details: {
              name: club.name,
              description: club.description,
              customContent: club.customContent,
              contact: club.contact || {},
              contactEmails: club.contactEmails || [],
            },
          };
        }
      }
      setClubEvents(eventsMap);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const subscribeToClub = useCallback(
    async (clubId, clubName, events) => {
      try {
        if (!currentUser?.email) return;
        await api.post("/event/subscriptions", { userId: currentUser.email, clubId });
        setSubscribedClubs((prev) => (prev.includes(clubId) ? prev : [...prev, clubId]));
        setClubEvents((prev) => {
          if (prev[clubId]) return prev;
          return { ...prev, [clubId]: { clubName, events: events || [] } };
        });
      } catch (err) {
        console.error("subscribeToClub:", err);
      }
    },
    [currentUser]
  );

  const unsubscribeFromClub = useCallback(
    async (clubId) => {
      try {
        if (!currentUser?.email) return;
        await api.delete(`/event/subscriptions/${clubId}`, { params: { userId: currentUser.email } });
        setSubscribedClubs((prev) => prev.filter((id) => id !== clubId));
        setClubEvents((prev) => {
          const next = { ...prev };
          delete next[clubId];
          return next;
        });
      } catch (err) {
        console.error("unsubscribeFromClub:", err);
      }
    },
    [currentUser]
  );

  const getAllSubscribedEvents = useCallback(() => {
    const allEvents = [];
    Object.values(clubEvents).forEach((clubData) => {
      clubData.events.forEach((event) => {
        allEvents.push({ ...event, group: clubData.clubName });
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

  const addEventToClub = useCallback(async (clubId, clubName, event) => {
    try {
      await api.post("/event/events", { ...event, clubId, groupName: clubName });
    } catch (err) {
      console.error("addEventToClub:", err);
    }
  }, []);

  const updateClubDetails = useCallback((clubId, details) => {
    setClubEvents((prev) => {
      const existing = prev[clubId] || { clubName: details.name || "My Group", events: [], details: {} };
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
    (clubId) => subscribedClubs.includes(clubId),
    [subscribedClubs]
  );

  const addClub = useCallback(async (clubData, createdBy) => {
    try {
      const contactEmails = Array.isArray(clubData.contactEmails)
        ? clubData.contactEmails.filter((e) => e && String(e).trim()).map((e) => String(e).trim().toLowerCase())
        : [];
      const payload = {
        name: clubData.name || "Untitled Club",
        description: clubData.description || "",
        profileImageUrl: clubData.profileImageUrl || null,
        contact: {
          email: contactEmails[0] || clubData.contactEmail || "",
          phone: clubData.contactPhone || "",
          address: clubData.contactAddress || "",
        },
        contactEmails:
          contactEmails.length > 0
            ? contactEmails
            : clubData.contactEmail
            ? [String(clubData.contactEmail).trim().toLowerCase()]
            : [],
        customContent: clubData.customContent || "",
        upcomingEvents: [],
        createdBy: createdBy ? String(createdBy).trim().toLowerCase() : null,
      };
      const res = await api.post("/event/clubs", payload);
      const club = toClub(res.data);
      setCreatedClubs((prev) => [...prev, club]);
      return club;
    } catch (err) {
      console.error("addClub:", err);
    }
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

  const updateCreatedClub = useCallback(
    async (clubId, updates) => {
      try {
        const current = createdClubs.find((c) => c.id === clubId);
        if (!current) return;
        const payload = {
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.customContent !== undefined && { customContent: updates.customContent }),
          ...(updates.profileImageUrl !== undefined && { profileImageUrl: updates.profileImageUrl }),
          ...(updates.contact !== undefined && { contact: { ...current.contact, ...updates.contact } }),
          ...(Array.isArray(updates.contactEmails) && {
            contactEmails: updates.contactEmails
              .map((e) => String(e).trim().toLowerCase())
              .filter(Boolean),
          }),
        };
        const res = await api.put(`/event/clubs/${clubId}`, payload);
        const updated = toClub(res.data);
        setCreatedClubs((prev) => prev.map((c) => (c.id === clubId ? updated : c)));
      } catch (err) {
        console.error("updateCreatedClub:", err);
      }
    },
    [createdClubs]
  );

  const getCreatedClubById = useCallback(
    (clubId) => createdClubs.find((c) => c.id === clubId) || null,
    [createdClubs]
  );

  const deleteClub = useCallback(async (clubId) => {
    try {
      await api.delete(`/event/clubs/${clubId}`);
      setCreatedClubs((prev) => prev.filter((c) => c.id !== clubId));
      setSubscribedClubs((prev) => prev.filter((id) => id !== clubId));
      setClubEvents((prev) => {
        const next = { ...prev };
        delete next[clubId];
        return next;
      });
    } catch (err) {
      console.error("deleteClub:", err);
    }
  }, []);

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
        deleteClub,
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
