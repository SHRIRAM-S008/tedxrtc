import Link from "next/link";
import { Logo } from "./Logo";
import { EVENT, TEDX_DISCLAIMER } from "@/lib/event";
import { venue } from "@/lib/data/venue";

export function Footer() {
  return (
    <footer className="bg-[var(--color-gray-950)] border-t border-[var(--color-gray-700)] py-16 mt-32">
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
        {/* Brand */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <Link href="/" className="flex items-center focus-visible w-fit">
            <Logo className="h-20" />
          </Link>
          {/* Required independence disclaimer — full legible contrast (TEDX_RULES.md §1) */}
          <p className="text-small text-[var(--color-gray-300)] max-w-xs">
            {TEDX_DISCLAIMER}
          </p>
        </div>

        {/* Link + info columns */}
        <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10">
          <div className="flex flex-col gap-4">
            <h4 className="text-eyebrow text-[var(--color-gray-500)] mb-2">Sitemap</h4>
            <Link href="#speakers" className="text-small hover:text-[var(--color-red)] transition-colors focus-visible">Speakers</Link>
            <Link href="#venue" className="text-small hover:text-[var(--color-red)] transition-colors focus-visible">Venue</Link>
            <Link href="#tickets" className="text-small hover:text-[var(--color-red)] transition-colors focus-visible">Register</Link>
          </div>

          {/* Compact venue reference — the nav "Venue" anchor lands on the
              full Venue chapter in EventInformation, not here (duplicate ids
              are invalid HTML and only one should be a real anchor target). */}
          <div className="flex flex-col gap-4">
            <h4 className="text-eyebrow text-[var(--color-gray-500)] mb-2">Venue</h4>
            <p className="text-small text-[var(--color-gray-300)]">
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
              className="text-small text-white transition-colors hover:text-[var(--color-red)] focus-visible w-fit"
            >
              Open in Maps →
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-eyebrow text-[var(--color-gray-500)] mb-2">Connect</h4>
            <a href={EVENT.social.instagram} target="_blank" rel="noopener noreferrer" className="text-small hover:text-[var(--color-red)] transition-colors focus-visible">Instagram</a>
            <a href={`mailto:${EVENT.email}`} className="text-small hover:text-[var(--color-red)] transition-colors focus-visible break-all">{EVENT.email}</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-eyebrow text-[var(--color-gray-500)] mb-2">Legal</h4>
            <Link href="/privacy" className="text-small hover:text-[var(--color-red)] transition-colors focus-visible">Privacy Policy</Link>
            <Link href="/code-of-conduct" className="text-small hover:text-[var(--color-red)] transition-colors focus-visible">Code of Conduct</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 mt-16 pt-8 border-t border-[var(--color-gray-700)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-eyebrow text-[var(--color-gray-500)]">
          © {new Date().getFullYear()} {EVENT.shortName}. All rights reserved.
        </p>
        <p className="text-eyebrow text-[var(--color-gray-500)]">
          {EVENT.tedTagline}
        </p>
      </div>
    </footer>
  );
}
