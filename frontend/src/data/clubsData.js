// Centralized clubs data - in the future this will come from the backend
export const clubsData = {
  qsc: {
    id: "qsc",
    name: "Queen's Space Conference",
    description:
      "The Queen's Space conference hosts an annual event where space lovers meet conference-goers. If you have an interest in the incredible, a love for science, or just a good dose of curiosity - then this is for you! Please check out some of our events, and hit the subscribe button!",
    contact: {
      email: "someone@engsoc.queensu.ca",
      phone: "613-111-1111",
      address: "123 Queen's University Way",
    },
    customContent:
      "Groups can add photos or text content here! This is a space for clubs to showcase their unique content, share updates, and engage with their community.",
    upcomingEvents: [
      {
        id: 1,
        title: "Space Exploration Workshop",
        date: "2025-05-10",
        month: "MAY",
        day: "10",
        description:
          "Write down your notes here. For example: 1. My goal is.. 2. Some ideas and thoughts",
        category: "Workshop",
        price: 0,
      },
      {
        id: 2,
        title: "Astronomy Night",
        date: "2025-05-24",
        month: "MAY",
        day: "24",
        description:
          "Write down your notes here. For example: 1. My goal is... 2. Some ideas and thoughts",
        category: "Event",
        price: 5,
      },
    ],
  },
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

