import React, { useState } from "react";
import styles from "./Calendar.module.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // First day of this month (0 = Sun)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Total days this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Total days in previous month
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Build the 42-cell array
  const calendarCells = [];

  // 1. Add previous-month days (greyed)
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
    });
  }

  // 2. Add current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
    });
  }

  // 3. Add next-month filler days until we reach 42 cells
  let nextMonthDay = 1;
  while (calendarCells.length < 42) {
    calendarCells.push({
      day: nextMonthDay++,
      isCurrentMonth: false,
    });
  }

  // Month navigation
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Calendar</h2>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>Filter</h3>
          <ul>
            <li>Groups ▸</li>
            <li>Categories ▸</li>
            <li>Date Range ▸</li>
            <li>Price ▸</li>
          </ul>
        </aside>

        <div className={styles.calendarContainer}>
          <div className={styles.monthHeaderRow}>
            <button className={styles.arrowBtn} onClick={handlePrevMonth}>←</button>

            <div className={styles.monthHeader}>
              {monthName}, {year}
            </div>

            <button className={styles.arrowBtn} onClick={handleNextMonth}>→</button>
          </div>

          <div className={styles.grid}>
            {/* Weekday headers */}
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className={styles.weekday}>{d}</div>
            ))}

            {/* 42 grid cells */}
            {calendarCells.map((cell, i) => (
              <div
                key={i}
                className={`${styles.day} ${
                  cell.isCurrentMonth ? "" : styles.greyDay
                }`}
              >
                <span className={styles.dayNumber}>{cell.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
