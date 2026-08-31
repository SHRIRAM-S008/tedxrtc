export interface ScheduleEntry {
  id: string;
  time: string;
  title: string;
}

/**
 * Empty until the organizing team confirms the minute-by-minute running
 * order — the event date itself is confirmed (EVENT.date), but the agenda is
 * a separate fact and stays honestly "to be announced" (WORKFLOW.md §5)
 * until it's set.
 */
export const schedule: ScheduleEntry[] = [];
