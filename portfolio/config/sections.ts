export type PortfolioSectionKey =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "contact";

export type PortfolioSection = {
  key: string;
  id: string;
  /** Anchor id used for the in-page nav links. */
  anchor: string;
  navLabel: string | null;
  heading: string | null;
  description: string | null;
  visible: boolean;
};

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  tags: string[];
  isFeatured: boolean;
};

export type PortfolioSkill = {
  id: string;
  name: string;
  category: string;
  level: string;
  years: number | null;
  isFeatured: boolean;
};

export type PortfolioExperience = {
  id: string;
  company: string;
  title: string;
  location: string | null;
  employmentType: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  summary: string | null;
};

export type PortfolioEducation = {
  id: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  grade: string | null;
  summary: string | null;
};

export type PortfolioOwner = {
  name: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  email: string;
  links: {
    github: string;
    linkedin: string;
    website: string;
  };
  skills: PortfolioSkill[];
  projects: PortfolioProject[];
  experiences: PortfolioExperience[];
  educations: PortfolioEducation[];
  sections: PortfolioSection[];
  settings: Record<string, string>;
};
