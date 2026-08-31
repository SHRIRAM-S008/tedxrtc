import type { CampusBeat } from "@/types/campus-beat";

/**
 * The Rathinam Experience's visual story, in sequence — each beat answers one
 * question before the next is asked (see plan: "Where are we? / Who are these
 * people? / Why does this campus matter?").
 *
 * Events/Innovation/Community currently use generic TEDx conference photos
 * (not Rathinam's own campus/event photography) as stand-ins, at the user's
 * explicit direction after being flagged — DESIGN.md's "no stock photography"
 * rule is a known, deliberate exception here, not an oversight. Swap in real
 * campus/event photography when available (a one-line `imageUrl` edit).
 * Architecture/Students/Labs still have no image supplied — ImagePlaceholder
 * renders the DESIGN.md §6-compliant named frame for those.
 *
 * `stat` is deliberately omitted on every beat below — a labs/ventures/etc.
 * count would be a factual claim about the campus, and WORKFLOW.md §5 forbids
 * shipping an invented number (same principle as EVENT.date staying unset
 * until confirmed). Add real, confirmed figures here once the organizing team
 * supplies them; until then these beats run on imagery + copy alone.
 */
export const campusBeats: CampusBeat[] = [
  {
    id: "architecture",
    number: "01",
    question: "Where are we?",
    heading: "A campus built to be walked through, not just attended.",
    caption: "Architecture",
    alt: "Rathinam Technical Campus architecture",
  },
  {
    id: "students",
    number: "02",
    question: "Who is this for?",
    heading: "Every corridor here is mid-conversation.",
    caption: "Students",
    alt: "Students on campus at Rathinam Technical Campus",
  },
  {
    id: "labs",
    number: "03",
    question: "What gets built here?",
    heading: "Ideas that outgrow the whiteboard end up here.",
    caption: "Labs",
    alt: "Labs and workshops at Rathinam Technical Campus",
  },
  {
    id: "events",
    number: "04",
    question: "What happens here?",
    heading: "The campus doesn't wait for an occasion to gather.",
    caption: "Events",
    imageUrl: "/images/campus/events.jpg",
    alt: "TEDx stage with audience",
  },
  {
    id: "innovation",
    number: "05",
    question: "Why does this matter?",
    heading: "Innovation, here, is a daily habit — not an initiative.",
    caption: "Innovation",
    imageUrl: "/images/campus/innovation.jpg",
    alt: "TEDx branding collage",
  },
  {
    id: "community",
    number: "06",
    question: "Who carries it forward?",
    heading: "A community that keeps handing the work to the next person.",
    caption: "Community",
    imageUrl: "/images/campus/community.jpg",
    alt: "Conference audience in a large auditorium",
  },
];
