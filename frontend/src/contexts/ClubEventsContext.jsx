import { createContext, useContext, useState, useCallback } from "react";

const ClubEventsContext = createContext();

export const useClubEvents = () => {
  const context = useContext(ClubEventsContext);
  if (!context) {
    throw new Error("useClubEvents must be used within ClubEventsProvider");
  }
  return context;
};

export const ClubEventsProvider = ({ children }) => {
  const [subscribedClubs, setSubscribedClubs] = useState([]);
  const [clubEvents, setClubEvents] = useState({});

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

  return (
    <ClubEventsContext.Provider
      value={{
        subscribedClubs,
        clubEvents,
        subscribeToClub,
        unsubscribeFromClub,
        getAllSubscribedEvents,
        setClubEventsForClub,
        addEventToClub,
        updateClubDetails,
        isSubscribed,
      }}
    >
      {children}
    </ClubEventsContext.Provider>
  );
};
