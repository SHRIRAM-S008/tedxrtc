export interface SpeakerSlot {
  id: string;
  /** Display number, "01"-"09". A layout choice for a clean 3x3 grid, not a
   *  confirmed fact about the final speaker count. */
  number: string;
}

/**
 * No names, bios, or companies — the lineup isn't announced yet
 * (TEDX_RULES.md §4, WORKFLOW.md §5). Nine numbered mystery slots, not nine
 * placeholder people. Array order is the reveal/DOM order (plain 3x3 grid,
 * no separate ordering needed).
 */
export const speakerSlots: SpeakerSlot[] = [
  { id: "s1", number: "01" },
  { id: "s2", number: "02" },
  { id: "s3", number: "03" },
  { id: "s4", number: "04" },
  { id: "s5", number: "05" },
  { id: "s6", number: "06" },
  { id: "s7", number: "07" },
  { id: "s8", number: "08" },
  { id: "s9", number: "09" },
];
