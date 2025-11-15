import React from 'react'
import styles from "./Calendar.module.css";

const Calendar = () => {
  return (
    <div className={styles.page}>
      

      {/* PAGE TITLE */}
      <h2 className={styles.pageTitle}>Calendar</h2>

      <div className={styles.layout}>
        {/* FILTER SIDEBAR */}
        <aside className={styles.sidebar}>
          <h3>Filter</h3>
          <ul>
            <li>Groups ▸</li>
            <li>Categories ▸</li>
            <li>Date Range ▸</li>
            <li>Price ▸</li>
          </ul>
        </aside>

        {/* CALENDAR */}
        <div className={styles.calendarContainer}>
          <div className={styles.monthHeader}>April, 2025</div>

          <div className={styles.grid}>
            {/* Weekday headers */}
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className={styles.weekday}>
                {d}
              </div>
            ))}

            {/* Calendar days */}
            {[
              "", "", "", "", "", "", "",
              1, 2, 3, 4, 5,
              6, 7, 8, 9, 10, 11, 12,
              13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25, 26,
              27, 28, 29, 30
            ].map((day, i) => (
              <div key={i} className={styles.day}>
                {day !== "" && <span className={styles.dayNumber}>{day}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar
