import { getCurrentProfile } from "@/lib/supabase/profile";
import { PortfolioProjects, type PortfolioOwner } from "@/portfolio/config/sections";

const FALLBACK_OWNER = {
  name: "Your Name",
  headline: "Full-stack Developer",
  bio: "Add your details from the admin panel and they will appear here.",
  avatarUrl: "",
  location: "",
  email: "",
  links: { github: "", linkedin: "", website: "" },
};

export async function getPortfolioOwner(): Promise<{
  owner: PortfolioOwner;
  isPersonalised: boolean;
}> {
  const current = await getCurrentProfile();
  const profile = current?.profile ?? null;
  const skills = current?.skills ?? [];

  const owner: PortfolioOwner = {
    name: profile?.display_name || FALLBACK_OWNER.name,
    headline: profile?.headline || FALLBACK_OWNER.headline,
    bio: profile?.bio || FALLBACK_OWNER.bio,
    avatarUrl: profile?.avatar_url ?? "",
    location: profile?.location ?? "",
    email: current?.user.email ?? "",
    links: {
      github: profile?.github_url ?? "",
      linkedin: profile?.linkedin_url ?? "",
      website: profile?.website_url ?? "",
    },
    skills,
    projects: PortfolioProjects.projects(),
  };

  return { owner, isPersonalised: Boolean(profile?.display_name) };
}