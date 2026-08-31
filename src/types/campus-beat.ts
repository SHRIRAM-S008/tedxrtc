export interface CampusStat {
  label: string;
  value: string;
}

export interface CampusBeat {
  id: string;
  /** Display order, "01"–"06". */
  number: string;
  /** The question this beat answers (see the plan's visual-storytelling sequence). */
  question: string;
  heading: string;
  caption: string;
  /** Omit until real campus photography/video is supplied. */
  imageUrl?: string;
  alt: string;
  stat?: CampusStat;
}
