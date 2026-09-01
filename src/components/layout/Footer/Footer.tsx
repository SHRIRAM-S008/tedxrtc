import Link from "next/link";
import { Logo } from "../Logo";
import { EVENT, TEDX_DISCLAIMER } from "@/lib/event";
import { venue } from "@/lib/data/venue";
import { cn } from "@/lib/utils";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={cn(styles.brandLink, "focus-visible")}>
            <Logo className={styles.logo} />
          </Link>
          {/* Required independence disclaimer — full legible contrast (TEDX_RULES.md §1) */}
          <p className={cn("text-small", styles.disclaimer)}>
            {TEDX_DISCLAIMER}
          </p>
        </div>

        {/* Link + info columns */}
        <div className={styles.linksGrid}>
          <div className={styles.column}>
            <h4 className={cn("text-eyebrow", styles.columnTitle)}>Sitemap</h4>
            <Link href="#speakers" className={cn("text-small", styles.link, "focus-visible")}>Speakers</Link>
            <Link href="#venue" className={cn("text-small", styles.link, "focus-visible")}>Venue</Link>
            <Link href="#tickets" className={cn("text-small", styles.link, "focus-visible")}>Register</Link>
          </div>

          {/* Compact venue reference — the nav "Venue" anchor lands on the
              full Venue chapter in EventInformation, not here (duplicate ids
              are invalid HTML and only one should be a real anchor target). */}
          <div className={styles.column}>
            <h4 className={cn("text-eyebrow", styles.columnTitle)}>Venue</h4>
            <p className={cn("text-small", styles.venueText)}>
              {venue.name}
              <br />
              {venue.area}, {venue.city}
              <br />
              {venue.doorsLabel}
            </p>
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-small", styles.mapLink, "focus-visible")}
            >
              Open in Maps →
            </a>
          </div>

          <div className={styles.column}>
            <h4 className={cn("text-eyebrow", styles.columnTitle)}>Connect</h4>
            <a href={EVENT.social.instagram} target="_blank" rel="noopener noreferrer" className={cn("text-small", styles.link, "focus-visible")}>Instagram</a>
            <a href={`mailto:${EVENT.email}`} className={cn("text-small", styles.emailLink, "focus-visible")}>{EVENT.email}</a>
          </div>

          <div className={styles.column}>
            <h4 className={cn("text-eyebrow", styles.columnTitle)}>Legal</h4>
            <Link href="/privacy" className={cn("text-small", styles.link, "focus-visible")}>Privacy Policy</Link>
            <Link href="/code-of-conduct" className={cn("text-small", styles.link, "focus-visible")}>Code of Conduct</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={cn("text-eyebrow", styles.bottomText)}>
          © {new Date().getFullYear()} {EVENT.shortName}. All rights reserved.
        </p>
        <p className={cn("text-eyebrow", styles.bottomText)}>
          {EVENT.tedTagline}
        </p>
      </div>
    </footer>
  );
}
