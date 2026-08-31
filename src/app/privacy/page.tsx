import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${EVENT.name} collects and uses the information you share with us.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="How we handle your data" title="Privacy Policy" updated="August 2026">
      <p className="text-body-l text-[var(--color-gray-500)]">
        This is a working draft prepared for {EVENT.name}. The organizing team should review it
        (and confirm any third-party ticketing provider) before the site goes live.
      </p>

      <LegalSection heading="What we collect">
        <p>
          We only collect what a specific action needs. When you register we ask for your name,
          email, phone number, student status, and college or organization. When you contact us we
          ask for your name, email, and message. We do not collect anything else through this site.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          Registration details are used to reserve your seat and send you event confirmations and
          updates. Messages you send are used to respond to your enquiry. We do not sell your
          information, and we do not send marketing you did not ask for.
        </p>
      </LegalSection>

      <LegalSection heading="Sharing">
        <p>
          We share your details only with the services needed to run the event — for example, an
          email or ticketing provider. If ticketing is handled on an external platform, you will be
          told before you are handed off to it.
        </p>
      </LegalSection>

      <LegalSection heading="Retention & your choices">
        <p>
          We keep registration data until after the event, then remove what we no longer need. You
          can ask us to access or delete your information at any time by emailing us.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about your data? Email{" "}
          <a href={`mailto:${EVENT.email}`} className="text-[var(--color-red)] underline">{EVENT.email}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
