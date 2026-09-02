import { InViewGlitchText } from "@/components/motion/GlitchText";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { RegisterForm } from "@/components/sections/RegisterForm";
import { EVENT } from "@/lib/event";
import { cn } from "@/lib/utils";
import styles from "./Tickets.module.css";

/**
 * Chapter 6 — "Get Tickets". The page's one registration surface: every other
 * CTA ("Get Tickets" in the nav, "Register Now" in AboutEvent/TEDxArrival,
 * "Reserve Your Seat" in Finale) points at `#tickets`, which this section
 * owns. Left column carries the pitch + secondary contact info, right column
 * is the actual form (`RegisterForm`, already wired to the `registerAction`
 * server action).
 */
export function Tickets() {
  return (
    <section id="tickets" className={styles.section}>
      <div aria-hidden="true" className={styles.line} />
      <div aria-hidden="true" className={styles.dot} />

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <RevealOnScroll>
              <div className={styles.eyebrowRow}>
                <span aria-hidden="true" className={styles.eyebrowDash} />
                <span className={cn("text-eyebrow", styles.eyebrow)}>Get Tickets</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.08}>
              <h2 className={cn("text-display-l", styles.headline)}>
                <InViewGlitchText text="Claim Your Seat" />
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.14}>
              <p className={styles.subhead}>
                Don&rsquo;t just watch history.
                <br />
                Be in the room.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <p className={cn("text-body-l", styles.paragraph)}>
                Seats are limited. If the theme spoke to you, this event is for you, whether you
                are a student, faculty, or simply a curious mind.
              </p>
            </RevealOnScroll>

            <div className={styles.divider} />

            <RevealOnScroll delay={0.1}>
              <p className={cn("text-eyebrow", styles.enquiriesLabel)}>Other Enquiries</p>
              <p className={cn("text-body", styles.enquiriesText)}>
                Want to speak, sponsor, or volunteer? Email{" "}
                <a href={`mailto:${EVENT.email}`} className={styles.enquiriesLink}>
                  {EVENT.email}
                </a>{" "}
                or reach us on{" "}
                <a
                  href={EVENT.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.enquiriesLink}
                >
                  Instagram
                </a>
                .
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={0.15}>
            <div className={styles.formColumn}>
              <RegisterForm />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
