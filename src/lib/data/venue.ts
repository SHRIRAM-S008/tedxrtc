/**
 * Venue facts. Confirm the exact street address, room, and doors time with the
 * organizing team before launch — these are working values (WORKFLOW.md §5).
 */
export const venue = {
  name: "Rathinam Technical Campus",
  area: "Eachanari",
  city: "Coimbatore",
  region: "Tamil Nadu 641021",
  /** Concise directions line; replace with confirmed transit details. */
  gettingThere:
    "On Pollachi Main Road, ~12 km south of Coimbatore Junction. Parking on campus.",
  doorsLabel: "Doors 16:30",
  mapsUrl: "https://maps.google.com/?q=Rathinam+Technical+Campus+Coimbatore",
} as const;
