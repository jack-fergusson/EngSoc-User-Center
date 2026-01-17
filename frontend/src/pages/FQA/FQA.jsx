import React, { useMemo, useState } from "react";
import styles from "./fqa.module.css";

function FaqSection({ title, description, items, openIndex, onToggle }) {
  return (
    <section className={styles.card}>
      <h1 className={styles.cardTitle}>{title}</h1>

      <p className={styles.cardDescription}>{description}</p>

      <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>

      <div className={styles.faqList}>
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={`${title}-${idx}`} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqButton}
                onClick={() => onToggle(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
                  ▶
                </span>
                <span className={styles.questionText}>{item.q}</span>
              </button>

              {isOpen && (
                <div className={styles.answerWrap}>
                  <p className={styles.answerText}>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className={styles.moreQuestions}>
        For more questions, email{" "}
        <a className={styles.emailLink} href="mailto:essdev@engsoc.queensu.ca">
          essdev@engsoc.queensu.ca
        </a>
      </p>
    </section>
  );
}

export default function Fqa() {
  const [openClubs, setOpenClubs] = useState(null);
  const [openStudents, setOpenStudents] = useState(null);

  const clubsFaq = useMemo(
    () => [
      {
        q: "How do I register my club on the platform?",
        a: "Log in, go to your club profile, then follow the registration steps. An admin may need to approve it.",
      },
      {
        q: "Who can create events for a club?",
        a: "Only users with a club role (like Exec or Admin) can create and publish events for that club.",
      },
      {
        q: "Can we post recurring events?",
        a: "Yes. Create one event and select a repeating schedule, or duplicate it for each date if needed.",
      },
      {
        q: "How do we edit or cancel an event?",
        a: "Open the event page and choose Edit or Cancel. Changes update right away for users viewing the event.",
      },
      {
        q: "How do announcements work?",
        a: "Announcements let clubs post short updates. Users following your club will see them in their feed.",
      },
      {
        q: "How do we get help fast?",
        a: "Email ESSDev with the club name and a short description of the problem, plus screenshots if you can.",
      },
    ],
    []
  );

  const studentsFaq = useMemo(
    () => [
      {
        q: "Do I need an account to view events?",
        a: "You can browse public events without an account. You need an account to RSVP, save, or follow clubs.",
      },
      {
        q: "How do I RSVP to an event?",
        a: "Open the event and click RSVP. You can also remove your RSVP later from the same page.",
      },
      {
        q: "How do I follow a club?",
        a: "Go to the club page and click Follow. Following helps you see announcements and new events sooner.",
      },
      {
        q: "Why am I not seeing my RSVP?",
        a: "Refresh first. If it still does not show, log out and back in. If it keeps happening, email support.",
      },
      {
        q: "Can I change my email or password?",
        a: "Yes. Go to your profile settings to update your email, password, and notification preferences.",
      },
      {
        q: "How do I report an issue?",
        a: "Send a short message to the support email with what you tried, what happened, and a screenshot.",
      },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <FaqSection
          title="Clubs & Organizations"
          description="The EngSoc Student Centre helps clubs and organizations communicate and plan events on a centralized platform. The rest of the description should go right here, but I'm a little too lazy right now to write it down, so please replace it with actual useful text that works on the site."
          items={clubsFaq}
          openIndex={openClubs}
          onToggle={setOpenClubs}
        />

        <FaqSection
          title="Students & Users"
          description="The EngSoc Student Centre helps students discover events, follow clubs, and stay updated. The rest of the description should go right here, but I'm a little too lazy right now to write it down, so please replace it with actual useful text that works on the site."
          items={studentsFaq}
          openIndex={openStudents}
          onToggle={setOpenStudents}
        />
      </main>
    </div>
  );
}