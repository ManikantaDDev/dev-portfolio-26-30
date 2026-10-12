import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import StarField from "@/features/portfolio/star-field";
import {
  AboutSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  HeroSection,
  PortfolioFooter,
  PortfolioNav,
  ProjectsSection,
  SkillsSection,
} from "@/features/portfolio/sections";
import type { PortfolioOwner, PortfolioSection } from "@/portfolio/config/sections";
import { getPortfolio, isRenderableSection } from "@/lib/portfolio/owner";
import { getCurrentUser } from "@/lib/portfolio/queries";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export async function generateMetadata(): Promise<Metadata> {
  const owner = await getPortfolio();

  if (!owner) {
    return { title: "Portfolio" };
  }

  const title = owner.settings.site_title || owner.name || "Portfolio";

  return {
    title,
    description: owner.settings.site_description || owner.headline || undefined,
  };
}

function SectionRenderer({
  section,
  owner,
}: {
  section: PortfolioSection;
  owner: PortfolioOwner;
}) {
  switch (section.key) {
    case "hero":
      return <HeroSection owner={owner} />;
    case "about":
      return <AboutSection owner={owner} section={section} />;
    case "skills":
      return <SkillsSection owner={owner} section={section} />;
    case "experience":
      return <ExperienceSection owner={owner} section={section} />;
    case "projects":
      return <ProjectsSection projects={owner.projects} section={section} />;
    case "education":
      return <EducationSection owner={owner} section={section} />;
    case "contact":
      return <ContactSection owner={owner} section={section} />;
    default:
      return null;
  }
}

export default async function HomePage() {
  const [owner, user] = await Promise.all([getPortfolio(), getCurrentUser()]);

  if (!owner) {
    return <EmptyPortfolio isSignedIn={Boolean(user)} />;
  }

  const sections = owner.sections.filter((section) => isRenderableSection(section, owner));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04081C] text-blue-50">
      <StarField />

      <PortfolioNav
        sections={sections}
        siteTitle={owner.settings.site_title || owner.name}
        adminHref={user ? "/dashboard" : "/login"}
        adminLabel={user ? "Admin" : "Sign in"}
      />

      <main>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} owner={owner} />
        ))}
      </main>

      <PortfolioFooter text={owner.settings.footer_text} />
    </div>
  );
}

/** Shown only while nobody has published a portfolio yet. */
function EmptyPortfolio({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04081C] px-6 text-blue-50">
      <StarField />

      <div className="relative z-10 max-w-md space-y-4 text-center">
        <h1 className="bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Nothing published yet
        </h1>

        <p className="text-sm leading-relaxed text-blue-100/60">
          No portfolio has been set up, so there is nothing to show. Every section on this page is
          rendered from the database.
        </p>

        <Link
          href={isSignedIn ? "/dashboard" : "/login"}
          className={cn(buttonVariants({ size: "lg" }), "mt-4")}
        >
          {isSignedIn ? "Open your dashboard" : "Sign in to publish"}
          <ExternalLink data-icon="inline-end" />
        </Link>
      </div>
    </div>
  );
}
