import type { Skill } from "@/forms/config/validations";

export type PortfolioSectionKey = "hero" | "about" | "skills" | "projects" | "contact";

export type PortfolioSection = {
  key: PortfolioSectionKey;
  id: string;
  navLabel: string | null;
  visible: boolean;
};

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
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
  skills: Skill[];
  projects: PortfolioProject[];
};

export class PortfolioSections {
  /** Nav + render order. Sections with no content are hidden. */
  static sections(owner: Pick<PortfolioOwner, "skills" | "projects">): PortfolioSection[] {
    return [
      { key: "hero", id: "top", navLabel: null, visible: true },
      { key: "about", id: "about", navLabel: "About", visible: true },
      {
        key: "skills",
        id: "skills",
        navLabel: "Skills",
        visible: owner.skills.length > 0,
      },
      {
        key: "projects",
        id: "projects",
        navLabel: "Projects",
        visible: owner.projects.length > 0,
      },
      { key: "contact", id: "contact", navLabel: "Contact", visible: true },
    ];
  }
}

/**
 * Projects have no storage yet (the `projects` table needs
 * `supabase/migrations/*.sql` to be applied), so this is the placeholder source.
 */
export class PortfolioProjects {
  static projects(): PortfolioProject[] {
    return [];
  }
}