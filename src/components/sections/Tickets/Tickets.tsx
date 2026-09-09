import { InViewGlitchText } from "@/components/motion/GlitchText";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { EVENT } from "@/lib/event";
import { cn } from "@/lib/utils";
import styles from "./Tickets.module.css";

/**
 * Chapter 6 — "Get Tickets". The page's one registration surface: every other
 * CTA ("Get Tickets" in the nav, "Register Now" in AboutEvent/TEDxArrival,
 * "Reserve Your Seat" in Finale) points at `#tickets`, which this section
 * owns. Left column carries the pitch + secondary contact info, right column
 * lists the reservation phone, email, and social links.
 *
 * NOTE: the inline registration form was removed so the site can be built as
 * a static export (server actions require a Node runtime).
 */
const PHONE = "8754026622";
const EMAIL = "tedxrtc@rathinam.in";
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/tedxrtc?utm_source=qr" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tedxrtc/" },
];

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
            <div className={styles.contactColumn}>
              <p className={cn("text-eyebrow", styles.contactLabel)}>Reserve Your Seat</p>
              <p className={cn("text-body", styles.contactIntro)}>
                Reach out to reserve your spot for TEDxRTC.
              </p>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <span className={cn("text-body", styles.contactName)}>Phone</span>
                  <a
                    href={`tel:${PHONE}`}
                    className={cn("text-body-l", styles.contactPhone)}
                  >
                    {PHONE}
                  </a>
                </li>
                <li className={styles.contactItem}>
                  <span className={cn("text-body", styles.contactName)}>Email</span>
                  <a
                    href={`mailto:${EMAIL}`}
                    className={cn("text-body-l", styles.contactPhone)}
                  >
                    {EMAIL}
                  </a>
                </li>
              </ul>
              <div className={styles.socialRow}>
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("text-small", styles.socialLink)}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
