import React, { useState } from "react";
import styles from "./Calendar.module.css";

const Calendar = () => {
  // === SAMPLE EVENTS ===
  const sampleEvents = [
    {
      id: 1,
      title: "EngWeek Kickoff",
      date: "2025-11-15",
      category: "Event",
      group: "EngSoc",
      description: "Learn the basics of web development in this hands-on workshop.",
      price: 0,
      signupLink: 'https://www.engsoc.utoronto.ca/events/engweek-kickoff',
    },
    {
      id: 2,
      title: "Coding Workshop",
      date: "2025-11-15",
      category: "Workshop",
      group: "CS Club",
      description: "Learn the basics of web development in this hands-on workshop.",
      price: 20,
      signupLink: 'https://www.engsoc.utoronto.ca/events/engweek-kickoff',
    },
    {
      id: 3,
      title: "Coffeehouse",
      date: "2025-11-15",
      category: "Social",
      group: "AMS",
      description: "Learn the basics of web development in this hands-on workshop.",
      price: 5,
      signupLink: 'https://www.engsoc.utoronto.ca/events/engweek-kickoff',
    },
    {
      id: 4,
      title: "Math Club Meeting",
      date: "2025-11-16",
      category: "Event",
      group: "MathSoc",
      description: "Learn the basics of web development in this hands-on workshop.",
      price: 0,
      signupLink: 'https://www.engsoc.utoronto.ca/events/engweek-kickoff',
    },
  ];

  const [events, setEvents] = useState(sampleEvents);
  const [groupToggle, setGroupToggle] = useState(false);
  const [categoryToggle, setCategoryToggle] = useState(false);
  const [priceToggle, setPriceToggle] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // === FILTER EVENTS ===
  const filteredEvents = events.filter((event) => {
    const eventPrice = event.price || 0; // Assume price is 0 if not provided

    // Check group filter
    const groupMatch =
      selectedGroups.length === 0 || selectedGroups.includes(event.group);

    // Check category filter
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category);

    // Check price filter
    const priceMatch =
      (minPrice === "" || eventPrice >= parseFloat(minPrice)) &&
      (maxPrice === "" || eventPrice <= parseFloat(maxPrice));

    return groupMatch && categoryMatch && priceMatch;
  });

  // === GROUP EVENTS BY DATE ===
  const eventsByDate = {};
  filteredEvents.forEach((event) => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  // === STATE FOR CURRENTLY DISPLAYED MONTH ===
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // First weekday of the month (0 = Sun)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Number of days this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Number of days in previous month
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // === 1. PREVIOUS-MONTH DAYS ===
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      fullDate: `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
    });
  }

  // === 2. CURRENT MONTH DAYS ===
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      fullDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  // === 3. NEXT MONTH DAYS (until 42 cells total) ===
  let nextDay = 1;
  while (calendarCells.length < 42) {
    calendarCells.push({
      day: nextDay,
      isCurrentMonth: false,
      fullDate: `${year}-${String(month + 2).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`,
    });
    nextDay++;
  }

  // === HANDLE GROUP SELECTION ===
  const handleGroupSelection = (group) => {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  // === HANDLE CATEGORY SELECTION ===
  const handleCategorySelection = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // === MONTH SWITCHING ===
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const getGroupColor = (group) => {
    switch (group) {
      case "EngSoc":
        return "#FFD966"; // yellow
      case "CS Club":
        return "#9FE2BF"; // mint green
      case "AMS":
        return "#A0C4FF"; // soft blue
      case "SciFormal":
        return "#FFB3C1"; // pink
      case "MathSoc":
        return "#FFF1A8"; // pale gold
      default:
        return "#E0E0E0"; // neutral grey
    }
  };
  const handleEventClick = (event) => {
    setActiveEvent(event);
    setIsModalOpen(true);
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Calendar</h2>
        <button
          className={styles.hamburger}
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>
      </div>


      <div
        className={`${styles.layout} ${mobileFiltersOpen ? styles.layoutShift : ""
          }`}
      >
        {/* SIDEBAR */}
        <aside
          className={`${styles.sidebar} ${mobileFiltersOpen ? styles.sidebarOpen : ""
            }`}
        >
          <h3>Filter</h3>

          <ul>
            {/* GROUPS */}
            <li onClick={() => setGroupToggle(!groupToggle)}>
              Groups {groupToggle ? <span>▼</span> : <span>▶</span>}
            </li>
            {groupToggle &&
              ["EngSoc", "CS Club", "AMS", "SciFormal", "MathSoc"].map((group) => (
                <ul key={group} className={styles.sublist}>
                  <li>
                    <label htmlFor={group}>{group}</label>
                    <input
                      type="checkbox"
                      id={group}
                      name={group}
                      checked={selectedGroups.includes(group)}
                      onChange={() => handleGroupSelection(group)}
                    />
                  </li>
                </ul>
              ))}

            {/* CATEGORIES */}
            <li onClick={() => setCategoryToggle(!categoryToggle)}>
              Categories {categoryToggle ? <span>▼</span> : <span>▶</span>}
            </li>
            {categoryToggle &&
              ["Workshop", "Event", "Social"].map((category) => (
                <ul key={category} className={styles.sublist}>
                  <li>
                    <label htmlFor={category}>{category}</label>
                    <input
                      type="checkbox"
                      id={category}
                      name={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategorySelection(category)}
                    />
                  </li>
                </ul>
              ))}

            {/* PRICE */}
            <li onClick={() => setPriceToggle(!priceToggle)}>
              Price {priceToggle ? <span>▼</span> : <span>▶</span>}
            </li>
            {priceToggle && (
              <div className={styles.priceRange}>
                <label htmlFor="minPrice">Min:</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={minPrice}
                  placeholder="0"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <label htmlFor="maxPrice">Max:</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={maxPrice}
                  placeholder="100"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            )}
          </ul>

          {/* Mobile close button */}
          <button
            className={styles.mobileCloseBtn}
            onClick={() => setMobileFiltersOpen(false)}
          >
            Close Filters
          </button>
        </aside>



        {/* CALENDAR */}
        <div className={styles.calendarContainer}>

          {/* Month navigation bar */}
          <div className={styles.monthHeaderRow}>
            <button className={styles.arrowBtn} onClick={handlePrevMonth}>
              ←
            </button>

            <div className={styles.monthHeader}>
              {monthName}, {year}
            </div>

            <button className={styles.arrowBtn} onClick={handleNextMonth}>
              →
            </button>
          </div>

          {/* GRID */}
          <div className={styles.grid}>
            {/* Weekday labels */}
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className={styles.weekday}>
                {d}
              </div>
            ))}

            {/* 42 days */}
            {calendarCells.map((cell, i) => (
              <div
                key={i}
                className={`${styles.day} ${!cell.isCurrentMonth && styles.greyDay}`}
              >
                <span className={styles.dayNumber}>{cell.day}</span>

                <div className={styles.eventsContainer}>
                  {eventsByDate[cell.fullDate]?.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={styles.eventTag}
                      style={{
                        backgroundColor: getGroupColor(event.group),
                        color: "black",
                      }}
                      onClick={() => handleEventClick(event)}
                      role="button"
                    >
                      {event.title}
                    </div>
                  ))}

                  {eventsByDate[cell.fullDate]?.length > 3 && (
                    <button
                      className={styles.seeMoreButton}
                      onClick={() => console.log("See more events for", cell.fullDate)}
                    >
                      See More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {isModalOpen && activeEvent && (
          <div className={styles.modalOverlay} onClick={closeEventModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={closeEventModal}
              >
                ×
              </button>
              <h3>{activeEvent.title}</h3>
              <p className={styles.modalLabel}>Date</p>
              <p>{formatDate(activeEvent.date)}</p>
              <p className={styles.modalLabel}>Group</p>
              <p>{activeEvent.group}</p>
              <p className={styles.modalLabel}>Category</p>
              <p>{activeEvent.category}</p>
              <p className={styles.modalLabel}>Price</p>
              <p>{activeEvent.price ? `$${activeEvent.price}` : "Free"}</p>
              {activeEvent.description && (
                <>
                  <p className={styles.modalLabel}>Description</p>
                  <p>{activeEvent.description}</p>
                </>
              )}
              {activeEvent.signupLink && (
                <>
                  <p className={styles.modalLabel}>Signup Link</p>
                  <a
                    href={activeEvent.signupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.signupLink}
                  >
                    {activeEvent.signupLink}
                  </a>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
