export type TeamCategory = "Leadership" | "Operations" | "Impact Team";

export interface TeamMember {
  id: string;
  /** Always shown — the role/function on the team, never a placeholder person. */
  role: string;
  /** Set once the organizing team confirms who's filling the role. */
  announced: boolean;
  name?: string;
  imageUrl?: string;
  /** CSS object-position value to reframe a portrait within its crop (e.g. "top"). */
  objectPosition?: string;
  category?: TeamCategory;
  /** Short first-person line revealed on hover (TeamCredits' Leadership/Operations rows). */
  quote?: string;
  portraitAlt?: string;
}
