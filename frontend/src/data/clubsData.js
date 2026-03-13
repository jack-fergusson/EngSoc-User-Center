// Centralized clubs data - in the future this will come from the backend
export const clubsData = {
  
  // Add more clubs here as needed
};

// Get all events from all clubs
export const getAllClubEvents = () => {
  const allEvents = [];
  Object.values(clubsData).forEach((club) => {
    club.upcomingEvents.forEach((event) => {
      allEvents.push({
        ...event,
        group: club.name,
      });
    });
  });
  return allEvents;
};

