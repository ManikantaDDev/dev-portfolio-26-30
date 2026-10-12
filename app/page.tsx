import Link from "next/link";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import StarField from "@/features/portfolio/star-field";
import {
  AboutSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
  SiteFooter,
  SkillsSection,
} from "@/features/portfolio/sections";
import {
  PortfolioSections,
  type PortfolioOwner,
  type PortfolioSectionKey,
} from "@/portfolio/config/sections";
import { getPortfolioOwner } from "@/lib/portfolio/owner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A dynamic, fully customizable portfolio platform.",
};

/** Projects takes a different prop shape, so it is rendered separately. */
function SectionRenderer({
  section,
  owner,
}: {
  section: Exclude<PortfolioSectionKey, "projects">;
  owner: PortfolioOwner;
}) {
  switch (section) {
    case "hero":
      return <HeroSection owner={owner} />;
    case "about":
      return <AboutSection owner={owner} />;
    case "skills":
      return <SkillsSection owner={owner} />;
    case "contact":
      return <ContactSection owner={owner} />;
  }
}

export default async function HomePage() {
  const { owner, isPersonalised } = await getPortfolioOwner();
  const sections = PortfolioSections.sections(owner).filter((section) => section.visible);
  const navSections = sections.filter((section) => section.navLabel);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04081C] text-blue-50">
      <StarField />

      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#04081C]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            {owner.name}
          </Link>

          <nav className="flex items-center gap-1">
            {navSections.map((section) => (
              <a
                key={section.key}
                href={`#${section.id}`}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-100/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {section.navLabel}
              </a>
            ))}
          </nav>

          <Link
            href={isPersonalised ? "/admin" : "/login"}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Lock />
            {isPersonalised ? "Admin" : "Sign in"}
          </Link>
        </div>
      </header>

      {!isPersonalised ? (
        <div className="mx-auto max-w-5xl px-6 pt-8">
          <p className="rounded-lg border border-blue-300/15 bg-blue-500/10 px-4 py-3 text-center text-xs text-blue-100/70">
            You&apos;re seeing placeholder content.{" "}
            <Link href="/login" className="font-medium text-blue-200 underline underline-offset-4">
              Sign in
            </Link>{" "}
            to show your own profile here.
          </p>
        </div>
      ) : null}

      <main>
        {sections.map((section) =>
          section.key === "projects" ? (
            <ProjectsSection key={section.key} projects={owner.projects} />
          ) : (
            <SectionRenderer key={section.key} section={section.key} owner={owner} />
          )
        )}
      </main>

      <SiteFooter />
    </div>
  );
}