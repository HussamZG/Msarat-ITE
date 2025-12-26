export type CourseCategory = 'general' | 'basic' | 'project' | 'specialized';
export type SkillType = 'professional' | 'intellectual' | 'general';
export type TrackType = 'SE' | 'AI' | 'SCN';

export interface Course {
  id: string;
  name: string;
  credits: number;
  category: CourseCategory;
  unlocks?: string[]; // IDs of courses this unlocks
  prerequisites?: string[]; // IDs of courses required before this
  minCreditsRequired?: number; // Special condition for projects
  description?: string;
  skillTypes?: SkillType[];
  track?: TrackType; // Specialization track
}

export interface YearStatus {
  year: string;
  nextThreshold: number;
  message: string;
  color: string;
}

export enum AcademicYear {
  First = 'السنة الأولى',
  Second = 'السنة الثانية',
  Third = 'السنة الثالثة',
  Fourth = 'السنة الرابعة',
  Fifth = 'السنة الخامسة',
  Graduated = 'مهندس خريج',
}