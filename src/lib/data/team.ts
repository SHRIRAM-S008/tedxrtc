import type { TeamMember } from "@/types/team-member";

/**
 * Organizing committee, confirmed by the organizing team
 * (TEDxRTC_Committee_Details.pdf). Portraits/quotes still unset — dropping a
 * photo file path into `imageUrl` or a line into `quote` is a pure content
 * edit (WORKFLOW.md §4), no component change needed; until then
 * ImagePlaceholder renders the DESIGN.md §6-compliant named frame.
 */
export const team: TeamMember[] = [
  // Core Leadership
  { id: "chief-patron", category: "Leadership", role: "Chief Patron", name: "Dr. Madan A Sendhil", announced: true, imageUrl: "/images/team/dr-madan-a-sendhil.jpeg", quote: "Supporting ideas that shape our future is not just a responsibility — it is our privilege." },
  { id: "patron", category: "Leadership", role: "Patron", name: "Dr. B. Nagaraj", announced: true, imageUrl: "/images/team/dr-b-nagaraj.jpeg", quote: "A TEDx event is not just about talks — it is about the conversations that start after the lights go down." },
  { id: "co-patron", category: "Leadership", role: "Co-Patron", name: "Dr. R. Manickam", announced: true, imageUrl: "/images/team/r-manickam.jpeg", quote: "When we give a stage to unfinished ideas, we give permission to the next generation to complete them." },
  { id: "convener", category: "Leadership", role: "Convener", name: "Dr. K. Geetha", announced: true, imageUrl: "/images/team/geetha.png", quote: "The work that matters is never finished — it is handed to the next person who can carry it further." },
  { id: "curator", category: "Leadership", role: "Curator", name: "Mr. Pradeepraj M S", announced: true, imageUrl: "/images/team/pradeepraj-m-s.jpeg", quote: "Every great talk begins with a question that refuses to be ignored. Our stage is for those questions." },
  { id: "co-curator", category: "Leadership", role: "Co-Curator", name: "Dr. Suriyaraj", announced: true, imageUrl: "/images/team/suriyaraj.jpeg", quote: "Ideas worth spreading are the ones that refuse to sit still — and our job is to make sure they do not." },

  // Operations Team
  { id: "lead-organizer", category: "Operations", role: "Lead Organizer", name: "Ms. Shanmugha Jeyashree B", announced: true, imageUrl: "/images/team/shanmugha-jeyashree-b.jpeg" },
  { id: "executive-coordinator", category: "Operations", role: "Executive Coordinator", name: "Ms. Manju S", announced: true, imageUrl: "/images/team/manju-s.jpeg" },
  { id: "agenda-coordinator", category: "Operations", role: "Agenda Coordinator", name: "Ms. Sangeetha E", announced: true, imageUrl: "/images/team/sangeetha-eswaran.png" },
  { id: "logistics-coordinator", category: "Operations", role: "Logistics Coordinator", name: "Mr. Tamilarasan", announced: true, imageUrl: "/images/team/tamilarasan.png" },
  { id: "finance-coordinator", category: "Operations", role: "Finance Coordinator", name: "Mr. Kameshwaran", announced: true, imageUrl: "/images/team/kameshwaran.jpeg" },
  { id: "partnership-enabler", category: "Operations", role: "Partnership Enabler", name: "Mr. Logesh M", announced: true, imageUrl: "/images/team/logesh.jpeg" },
  { id: "hospitality-coordinator", category: "Operations", role: "Hospitality Coordinator", name: "Ms. Anisha Banu", announced: true },
  { id: "designer", category: "Operations", role: "Designer", name: "Mr. Sakthipriyan", announced: true, imageUrl: "/images/team/sakthipriyan.png" },
  { id: "web-developer", category: "Operations", role: "Web Developer", name: "Ms. Meghala", announced: true },
  { id: "venue-coordinator", category: "Operations", role: "Venue Coordinator", name: "Mr. Suhail", announced: true, imageUrl: "/images/team/suhail.jpeg" },
  { id: "outreach-coordinator", category: "Operations", role: "Outreach Coordinator", name: "Ms. Aadhila", announced: true, imageUrl: "/images/team/aadhila.png" },
  { id: "technical-lead", category: "Operations", role: "Technical Lead", name: "Mr. Kumar Shanu P K", announced: true },
  { id: "participants-coordinator", category: "Operations", role: "Participants Coordinator", name: "Mr. Buvan Kirthik", announced: true, imageUrl: "/images/team/buvan-kirthik-rajan.png" },

  // Impact Team
  { id: "igniter", category: "Impact Team", role: "Igniter", name: "Ms. Benita", announced: true },
  { id: "ambassador", category: "Impact Team", role: "Ambassador", name: "Mr. Shriram S", announced: true },
  { id: "promoter", category: "Impact Team", role: "Promoter", name: "Ms. Swaathy Sahaana", announced: true },
  { id: "moderator", category: "Impact Team", role: "Moderator", name: "Mr. Kauif", announced: true },
  { id: "creator", category: "Impact Team", role: "Creator", name: "Mr. Shamanth", announced: true },
  { id: "transformer", category: "Impact Team", role: "Transformer", name: "Mr. Lakshmanan", announced: true },
];
