import { getPublicPortfolio } from "@/lib/portfolio/queries";
import type { SectionRow } from "@/types/database";
import type {
  PortfolioEducation,
  PortfolioExperience,
  PortfolioOwner,
  PortfolioProject,
  PortfolioSection,
  PortfolioSkill,
} from "@/portfolio/config/sections";

function toSections(rows: SectionRow[]): PortfolioSection[] {
  return rows.map((row) => ({
    key: row.name,
    id: row.id,
    anchor: row.name,
    navLabel: row.label,
    heading: row.heading,
    description: row.description,
    visible: row.is_visible,
  }));
}

/**
 * Resolves everything the public page renders. Returns null while no portfolio
 * has been claimed, so the page can show an honest empty state rather than
 * inventing placeholder content.
 */
export async function getPortfolio(): Promise<PortfolioOwner | null> {
  const data = await getPublicPortfolio();

  if (!data) return null;

  const skills: PortfolioSkill[] = data.skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    level: skill.level,
    years: skill.years,
    isFeatured: skill.is_featured,
  }));

  const projects: PortfolioProject[] = data.projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.image_url,
    liveUrl: project.live_url,
    githubUrl: project.github_url,
    tags: project.tags ?? [],
    isFeatured: project.is_featured,
  }));

  const experiences: PortfolioExperience[] = data.experiences.map((experience) => ({
    id: experience.id,
    company: experience.company,
    title: experience.title,
    location: experience.location,
    employmentType: experience.employment_type,
    startDate: experience.start_date,
    endDate: experience.end_date,
    isCurrent: experience.is_current,
    summary: experience.summary,
  }));

  const educations: PortfolioEducation[] = data.educations.map((education) => ({
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    fieldOfStudy: education.field_of_study,
    startDate: education.start_date,
    endDate: education.end_date,
    grade: education.grade,
    summary: education.summary,
  }));

  return {
    name: data.owner.display_name ?? "",
    headline: data.owner.headline ?? "",
    bio: data.owner.bio ?? "",
    avatarUrl: data.owner.avatar_url ?? "",
    location: data.owner.location ?? "",
    email: data.owner.email ?? "",
    links: {
      github: data.owner.github_url ?? "",
      linkedin: data.owner.linkedin_url ?? "",
      website: data.owner.website_url ?? "",
    },
    skills,
    projects,
    experiences,
    educations,
    sections: toSections(data.sections),
    settings: data.settings,
  };
}

/**
 * A section is only rendered when it is visible in `sections_config` and has
 * something to show.
 */
export function isRenderableSection(section: PortfolioSection, owner: PortfolioOwner): boolean {
  if (!section.visible) return false;

  switch (section.key) {
    case "skills":
      return owner.skills.length > 0;
    case "projects":
      return owner.projects.length > 0;
    case "experience":
      return owner.experiences.length > 0;
    case "education":
      return owner.educations.length > 0;
    default:
      return true;
  }
}
