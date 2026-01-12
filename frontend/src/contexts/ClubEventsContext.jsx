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
    setSubscribedClubs((prev) => {
      if (!prev.includes(clubId)) {
        return [...prev, clubId];
      }
      return prev;
    });
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
        isSubscribed,
      }}
    >
      {children}
    </ClubEventsContext.Provider>
  );
};

