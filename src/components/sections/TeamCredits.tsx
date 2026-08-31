import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Marquee } from "@/components/ui/marquee";
import { team } from "@/lib/data/team";
import type { TeamMember } from "@/types/team-member";

function PortraitRow({ member, index }: { member: TeamMember; index: number }) {
  const reversed = index % 2 === 1;
  const displayName = member.announced && member.name ? member.name : "To be announced";

  return (
    <RevealOnScroll delay={0.05 * index}>
      <div
        className={`group flex flex-col items-center gap-8 md:gap-12 ${reversed ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        <div className="w-full md:w-[38%]">
          <ImagePlaceholder
            src={member.imageUrl}
            alt={member.portraitAlt ?? `Portrait of ${displayName}, ${member.role}`}
            caption={displayName}
            aspectRatio="3 / 4"
          />
        </div>
        <div className="relative w-full overflow-hidden md:w-[52%]">
          <p className="text-eyebrow text-[var(--color-red)]">{member.role}</p>
          <h3 className="mt-2 text-display-m font-heading text-white">{displayName}</h3>

          {member.quote && (
            <div className="mt-6 max-w-md overflow-hidden">
              <p className="translate-y-full text-body-l text-[var(--color-gray-300)] transition-transform duration-base ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                “{member.quote}”
              </p>
            </div>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}

function OperationsGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  return (
    <div className="flex flex-col gap-10">
      <RevealOnScroll>
        <p className="text-eyebrow text-[var(--color-gray-500)]">Operations</p>
      </RevealOnScroll>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member, i) => {
          const displayName = member.announced && member.name ? member.name : "To be announced";
          return (
            <RevealOnScroll key={member.id} delay={0.03 * i}>
              <div className="flex flex-col gap-4">
                <ImagePlaceholder
                  src={member.imageUrl}
                  alt={member.portraitAlt ?? `Portrait of ${displayName}, ${member.role}`}
                  caption={displayName}
                  aspectRatio="1 / 1"
                />
                <div>
                  <p className="text-eyebrow text-[var(--color-red)]">{member.role}</p>
                  <h3 className="mt-1 text-h3 font-heading text-white">{displayName}</h3>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}

function CategorySection({
  title,
  members,
}: {
  title: string;
  members: TeamMember[];
}) {
  if (members.length === 0) return null;
  return (
    <div className="flex flex-col gap-14">
      <RevealOnScroll>
        <p className="text-eyebrow text-[var(--color-gray-500)]">{title}</p>
      </RevealOnScroll>
      <div className="flex flex-col gap-20 md:gap-28">
        {members.map((member, i) => (
          <PortraitRow key={member.id} member={member} index={i} />
        ))}
      </div>
    </div>
  );
}

function ImpactMarquee({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  return (
    <div className="flex flex-col gap-8">
      <RevealOnScroll>
        <p className="text-eyebrow text-[var(--color-gray-500)]">Impact Team</p>
      </RevealOnScroll>
      <Marquee pauseOnHover className="[--duration:32s] [--gap:2rem]">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex shrink-0 items-center gap-3 rounded-[4px] border border-[var(--color-gray-700)] bg-[var(--color-gray-950)] px-6 py-4"
          >
            <span className="text-eyebrow text-[var(--color-gray-500)]">{member.role}</span>
            <span className="text-small text-[var(--color-gray-300)]">
              {member.announced && member.name ? member.name : "To be announced"}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

/**
 * Chapter 4 — the people behind the event, presented as production credits
 * rather than a headshot grid. Three distinct visual identities by category,
 * scaled to the real roster's size (TEDxRTC_Committee_Details.pdf): Split
 * Layout large portrait rows for the small Leadership group (6), a compact
 * card grid for the much larger Operations team (13) — 13 full-bleed rows
 * would make the section unreasonably long and repetitive — and the existing
 * Marquee primitive (ui/marquee.tsx) for Impact Team, reused rather than
 * building a new scroller (COMPONENTS.md's "compose primitives" rule).
 */
export function TeamCredits() {
  const leadership = team.filter((m) => m.category === "Leadership");
  const operations = team.filter((m) => m.category === "Operations");
  const impact = team.filter((m) => m.category === "Impact Team");

  return (
    <section id="team" className="relative overflow-hidden bg-[var(--color-black)] py-24 lg:py-40">
      <div className="container mx-auto flex flex-col gap-24 px-6 lg:gap-32 lg:px-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-eyebrow text-[var(--color-gray-500)]">Meet Our Team</p>
          <SplitTitle
            as="h2"
            text="The people bringing this stage to life."
            className="text-display-l text-white"
          />
        </div>

        <CategorySection title="Leadership" members={leadership} />
        <OperationsGrid members={operations} />
        <ImpactMarquee members={impact} />
      </div>
    </section>
  );
}
