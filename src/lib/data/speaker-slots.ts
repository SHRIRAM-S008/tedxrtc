export interface SpeakerSlot {
  id: string;
  /** Display number, "01"-"09". A layout/mystery-box choice for a balanced
   *  3x3 composition, not a confirmed fact about the final speaker count. */
  number: string;
  /** Explicit reveal order for the scroll stagger — independent of grid
   *  position, since the visual grid order and the intended reveal sequence
   *  differ (see Speakers.tsx). */
  revealOrder: number;
}

/**
 * No names, bios, or companies — the lineup isn't announced yet
 * (TEDX_RULES.md §4, WORKFLOW.md §5). Nine numbered mystery slots, not nine
 * placeholder people.
 */
export const speakerSlots: SpeakerSlot[] = [
  { id: "s1", number: "01", revealOrder: 1 },
  { id: "s2", number: "02", revealOrder: 2 },
  { id: "s3", number: "03", revealOrder: 3 },
  { id: "s4", number: "04", revealOrder: 4 },
  { id: "s5", number: "05", revealOrder: 5 },
  { id: "s6", number: "06", revealOrder: 6 },
  { id: "s7", number: "07", revealOrder: 7 },
  { id: "s8", number: "08", revealOrder: 8 },
  { id: "s9", number: "09", revealOrder: 9 },
];
