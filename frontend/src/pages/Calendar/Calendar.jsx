import React, { useState } from "react";
import styles from "./Calendar.module.css";

const Calendar = () => {
  // === SAMPLE EVENTS ===
  const sampleEvents = [
    {
      id: 1,
      title: "EngWeekKickoffEngWeek Kickoff EngWeek Kickoff EngWeek Kickoff EngWeek Kickoff",
      date: "2025-11-15",
      category: "Event",
      group: "EngSoc",
    },
    {
      id: 2,
      title: "Coding WorkshopCoding WorkshopCoding WorkshopCoding WorkshopCoding WorkshopCoding ",
      date: "2025-11-15",
      category: "Workshop",
      group: "CS Club",
    },
    {
      id: 3,
      title: "Coffeehouse",
      date: "2025-11-15",
      category: "Social",
      group: "AMS",
    },
    {
      id: 4,
      title: "Coffeehouse",
      date: "2025-11-15",
      category: "Social",
      group: "AMS",
    },
  ];

  const [events, setEvents] = useState(sampleEvents);
  const [groupToggle, setGroupToggle] = useState(false);
  const [categoryToggle, setCategoryToggle] = useState(false);
  const [priceToggle, setPriceToggle] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // === GROUP EVENTS BY DATE ===
  const eventsByDate = {};
  events.forEach((event) => {
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
  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Calendar</h2>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <h3>Filter</h3>
          <ul>
            <li onClick={() => setGroupToggle(!groupToggle)}>
              Groups {groupToggle ? <span>▼</span> : <span>▶</span>}
            </li>
            {groupToggle &&
              ["EngSoc", "CS Club", "AMS", "SciFormal", "MathSoc"].map((group) => (
                <ul key={group} className={styles.sublist}>
                  <li>
                    <label htmlFor={group}>{group}</label>
                    <input type="checkbox" id={group} name={group} />
                  </li>
                </ul>
              ))
            }
            <li onClick={() => setCategoryToggle(!categoryToggle)}>
              Categories {categoryToggle ? <span>▼</span> : <span>▶</span>}
            </li>
            {categoryToggle &&
              ["Workshop", "Events", "Social"].map((group) => (
                <ul key={group} className={styles.sublist}>
                  <li>
                    <label htmlFor={group}>{group}</label>
                    <input type="checkbox" id={group} name={group} />
                  </li>
                </ul>
              ))
            }
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
                  placeholder="0"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <label htmlFor="maxPrice">Max:</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="100"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            )}
          </ul>
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
                  >
                    {event.title}
                  </div>
                ))}

                {eventsByDate[cell.fullDate]?.length > 3 && (
                  <button
                    className={styles.seeMoreButton}
                    onClick={() => handleSeeMore(cell.fullDate)}
                  >
                    See More...
                  </button>
                )}
              </div>
            </div>
            
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
