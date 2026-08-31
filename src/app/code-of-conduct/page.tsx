import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: "Code of Conduct",
  description: `The standards of behaviour we expect from everyone at ${EVENT.name}.`,
};

export default function CodeOfConductPage() {
  return (
    <LegalPage eyebrow="A shared space for ideas" title="Code of Conduct" updated="August 2026">
      <p className="text-body-l text-[var(--color-gray-500)]">
        This is a working draft for {EVENT.name}. The organizing team should review and adapt it —
        including the reporting contact — before the site goes live.
      </p>

      <LegalSection heading="What we expect">
        <p>
          {EVENT.name} is a space for ideas and the people who carry them. We expect everyone —
          attendees, speakers, volunteers, sponsors, and organizers — to be respectful, curious, and
          considerate of one another, on stage and off.
        </p>
      </LegalSection>

      <LegalSection heading="What is not acceptable">
        <p>
          Harassment, discrimination, intimidation, or disruptive behaviour of any kind is not
          welcome — including comments related to gender, identity, appearance, disability, religion,
          caste, or background; unwelcome attention; and recording or photographing people who have
          asked not to be. This applies both in person and online.
        </p>
      </LegalSection>

      <LegalSection heading="Reporting">
        <p>
          If you experience or witness behaviour that breaks this code, tell a member of the
          organizing team or email{" "}
          <a href={`mailto:${EVENT.email}`} className="text-[var(--color-red)] underline">{EVENT.email}</a>.
          Reports are handled discreetly.
        </p>
      </LegalSection>

      <LegalSection heading="Consequences">
        <p>
          The organizing team may take any action it considers appropriate, including a warning or
          removal from the event without refund, and will support anyone affected.
        </p>
      </LegalSection>

      <LegalSection heading="Scope">
        <p>
          This code applies to all event spaces — the venue, related gatherings, and official online
          channels — for the duration of {EVENT.name}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
