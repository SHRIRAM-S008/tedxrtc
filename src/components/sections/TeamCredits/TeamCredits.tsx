import Image from "next/image";
import { InViewGlitchText } from "@/components/motion/GlitchText";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { team } from "@/lib/data/team";
import type { TeamMember } from "@/types/team-member";
import { cn } from "@/lib/utils";
import styles from "./TeamCredits.module.css";

function PortraitRow({ member, index }: { member: TeamMember; index: number }) {
  const reversed = index % 2 === 1;
  const displayName = member.announced && member.name ? member.name : "To be announced";

  return (
    <RevealOnScroll delay={0.05 * index}>
      <div className={reversed ? styles.portraitRowReversed : styles.portraitRow}>
        <div className={styles.portraitImageWrap}>
          <ImagePlaceholder
            src={member.imageUrl}
            alt={member.portraitAlt ?? `Portrait of ${displayName}, ${member.role}`}
            caption={displayName}
            aspectRatio="3 / 4"
            objectPosition={member.objectPosition}
          />
        </div>
        <div className={styles.portraitContent}>
          <p className={cn("text-eyebrow", styles.portraitRole)}>{member.role}</p>
          <h3 className={cn("text-display-l", styles.portraitName)}>{displayName}</h3>

          {member.quote && (
            <div className={styles.portraitQuoteWrap}>
              <p className={cn("text-body-l", styles.portraitQuote)}>
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
    <div className={styles.opsWrap}>
      <RevealOnScroll>
        <p className={cn("text-eyebrow", styles.categoryLabel)}>Operations</p>
      </RevealOnScroll>
      <div className={styles.opsGrid}>
        {members.map((member, i) => {
          const displayName = member.announced && member.name ? member.name : "To be announced";
          return (
            <RevealOnScroll key={member.id} delay={0.03 * i}>
              <div className={styles.opsCard}>
                <ImagePlaceholder
                  src={member.imageUrl}
                  alt={member.portraitAlt ?? `Portrait of ${displayName}, ${member.role}`}
                  caption={displayName}
                  aspectRatio="1 / 1"
                  objectPosition={member.objectPosition ?? "top"}
                />
                <div>
                  <p className={cn("text-eyebrow", styles.opsRole)}>{member.role}</p>
                  <h3 className={cn("text-h3", styles.opsName)}>{displayName}</h3>
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
    <div className={styles.categoryWrap}>
      <RevealOnScroll>
        <p className={cn("text-eyebrow", styles.categoryLabel)}>{title}</p>
      </RevealOnScroll>
      <div className={styles.portraitRows}>
        {members.map((member, i) => (
          <PortraitRow key={member.id} member={member} index={i} />
        ))}
      </div>
    </div>
  );
}

function ImpactList({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  return (
    <div className={styles.impactWrap}>
      <RevealOnScroll>
        <p className={cn("text-eyebrow", styles.categoryLabel)}>Impact Team</p>
      </RevealOnScroll>
      <RevealOnScroll>
        <Image
          src="/images/team/impact-team.png"
          alt="Impact Team"
          width={2400}
          height={900}
          className={styles.impactLabel}
          priority={false}
        />
      </RevealOnScroll>
    </div>
  );
}

/**
 * Chapter 3 — the people behind the event, presented as production credits
 * rather than a headshot grid. Three distinct visual identities by category,
 * scaled to the real roster's size (TEDxRTC_Committee_Details.pdf): Split
 * Layout large portrait rows for the small Leadership group (6), a compact
 * card grid for the much larger Operations team (13) — 13 full-bleed rows
 * would make the section unreasonably long and repetitive — and a clean
 * text list with a red left accent line for Impact Team (no photos).
 */
export function TeamCredits() {
  const leadership = team.filter((m) => m.category === "Leadership");
  const operations = team.filter((m) => m.category === "Operations");
  const impact = team.filter((m) => m.category === "Impact Team");

  return (
    <section id="team" className={styles.section}>
      <div className={styles.container}>
        {/* Chapter opener — "MEET OUR TEAM" as a stacked, display-sized title
            in the same editorial register as the hero's "THE UNFINISHED". */}
        <RevealOnScroll>
          <h2 className={cn("text-display-l", styles.title)}>
            <InViewGlitchText text="Meet Our" className={styles.titleRed} duration={350} />
            <InViewGlitchText text="Team" className={styles.titleWhite} delay={50} duration={250} />
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12}>
          <p className={cn("text-h2", styles.subtitle)}>The people bringing this stage to life be in this way</p>
        </RevealOnScroll>

        <CategorySection title="Leadership" members={leadership} />
        <OperationsGrid members={operations} />
        <ImpactList members={impact} />
      </div>
    </section>
  );
}
