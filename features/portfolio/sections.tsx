import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building,
  Code,
  Download,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type {
  PortfolioOwner,
  PortfolioProject,
  PortfolioSection,
} from "@/portfolio/config/sections";
import { cn } from "cn";

const PANEL =
  "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_32px_rgba(2,6,23,0.45)] backdrop-blur-md sm:p-8";

const SECTION_TITLE =
  "bg-gradient-to-r from-blue-300 via-sky-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl";

function formatMonth(value: string | null): string {
  if (!value) return "";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function formatRange(
  start: string | null,
  end: string | null,
  isCurrent = false,
): string {
  const from = formatMonth(start);
  const to = isCurrent ? "Present" : formatMonth(end);

  if (!from && !to) return "";

  return `${from || "\u2014"} \u2014 ${to || "\u2014"}`;
}

function SectionHeading({ section }: { section: PortfolioSection }) {
  if (!section.heading && !section.description) return null;

  return (
    <div className="mb-8 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/80">
        {section.navLabel ?? ""}
      </p>
      {section.heading ? <h2 className={SECTION_TITLE}>{section.heading}</h2> : null}
      {section.description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-blue-100/60">{section.description}</p>
      ) : null}
    </div>
  );
}

export function HeroSection({ owner }: { owner: PortfolioOwner }) {
  const badge = owner.settings.hero_badge;
  const ctaLabel = owner.settings.hero_cta_label;
  const resumeUrl = owner.settings.resume_url;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      {/* pointer-events-none so dragging a star through the text still works */}
      <div className="pointer-events-none mx-auto w-full max-w-3xl text-center">
        {badge ? (
          <div className="pointer-events-none inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-200">
            <span className="size-1.5 animate-pulse rounded-full bg-blue-300" />
            {badge}
          </div>
        ) : null}

        {owner.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={owner.avatarUrl}
            alt={owner.name}
            className="mx-auto mt-8 size-28 rounded-full border border-white/15 object-cover"
          />
        ) : null}

        <h1 className="mt-6 bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-5xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-7xl">
          {owner.name}
        </h1>

        {owner.headline ? (
          <p className="mt-4 text-lg font-medium text-blue-200/90 sm:text-xl">{owner.headline}</p>
        ) : null}

        {owner.bio ? (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-blue-100/60 sm:text-base">
            {owner.bio}
          </p>
        ) : null}

        {ctaLabel || resumeUrl ? (
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
            {ctaLabel ? (
              <a href="#projects" className={cn(buttonVariants({ size: "lg" }))}>
                {ctaLabel}
                <ArrowRight data-icon="inline-end" />
              </a>
            ) : null}
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <Download data-icon="inline-start" />
                Resume
              </a>
            ) : null}
          </div>
        ) : null}

        {owner.location ? (
          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-blue-200/50">
            <MapPin className="size-3.5" />
            {owner.location}
          </p>
        ) : null}

        <p className="mt-10 text-[0.7rem] uppercase tracking-[0.25em] text-blue-300/35">
          Drag the stars
        </p>
      </div>
    </section>
  );
}

export function AboutSection({
  owner,
  section,
}: {
  owner: PortfolioOwner;
  section: PortfolioSection;
}) {
  return (
    <section id={section.anchor} className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading section={section} />

      <div className={cn(PANEL, "grid gap-8 sm:grid-cols-[1.6fr_1fr]")}>
        <div className="space-y-4">
          {owner.bio ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-blue-50/80">
              {owner.bio}
            </p>
          ) : null}
        </div>

        <dl className="space-y-4 border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          {owner.name ? (
            <div>
              <dt className="text-xs uppercase tracking-wider text-blue-200/50">Name</dt>
              <dd className="mt-1 text-sm font-medium text-white">{owner.name}</dd>
            </div>
          ) : null}
          {owner.headline ? (
            <div>
              <dt className="text-xs uppercase tracking-wider text-blue-200/50">Role</dt>
              <dd className="mt-1 text-sm font-medium text-white">{owner.headline}</dd>
            </div>
          ) : null}
          {owner.location ? (
            <div>
              <dt className="text-xs uppercase tracking-wider text-blue-200/50">Location</dt>
              <dd className="mt-1 text-sm font-medium text-white">{owner.location}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs uppercase tracking-wider text-blue-200/50">Skills</dt>
            <dd className="mt-1 text-sm font-medium text-white">{owner.skills.length} listed</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function SkillsSection({
  owner,
  section,
}: {
  owner: PortfolioOwner;
  section: PortfolioSection;
}) {
  const grouped = owner.skills.reduce<Record<string, typeof owner.skills>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section id={section.anchor} className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading section={section} />

      <div className="grid gap-5 sm:grid-cols-2">
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category} className={PANEL}>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-200">
              <Sparkles className="size-4" />
              {category}
            </h3>

            <ul className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-300/20 bg-blue-500/10 px-2.5 py-1.5 text-sm text-blue-50"
                >
                  {skill.isFeatured ? (
                    <Star className="size-3.5 fill-blue-300 text-blue-300" aria-label="Featured" />
                  ) : null}
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-blue-200/55">{skill.level}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ExperienceSection({
  owner,
  section,
}: {
  owner: PortfolioOwner;
  section: PortfolioSection;
}) {
  return (
    <section id={section.anchor} className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading section={section} />

      <ol className="space-y-4">
        {owner.experiences.map((experience) => (
          <li key={experience.id} className={PANEL}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{experience.title}</h3>
                <p className="text-sm text-blue-200">{experience.company}</p>
              </div>

              <p className="text-xs text-blue-200/60">
                {formatRange(experience.startDate, experience.endDate, experience.isCurrent)}
              </p>
            </div>

            {experience.location || experience.employmentType ? (
              <p className="mt-2 flex flex-wrap items-center gap-x-3 text-xs text-blue-200/55">
                {experience.location ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {experience.location}
                  </span>
                ) : null}
                {experience.employmentType ? (
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3" />
                    {experience.employmentType}
                  </span>
                ) : null}
              </p>
            ) : null}

            {experience.summary ? (
              <p className="mt-3 text-sm leading-relaxed text-blue-100/65">{experience.summary}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EducationSection({
  owner,
  section,
}: {
  owner: PortfolioOwner;
  section: PortfolioSection;
}) {
  return (
    <section id={section.anchor} className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading section={section} />

      <div className="grid gap-5 sm:grid-cols-2">
        {owner.educations.map((education) => (
          <article key={education.id} className={PANEL}>
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <GraduationCap className="size-4 text-blue-200" />
              {education.institution}
            </h3>

            {education.degree || education.fieldOfStudy ? (
              <p className="mt-1 text-sm text-blue-200">
                {[education.degree, education.fieldOfStudy].filter(Boolean).join(", ")}
              </p>
            ) : null}

            <p className="mt-2 text-xs text-blue-200/55">
              {formatRange(education.startDate, education.endDate)}
              {education.grade ? ` \u00b7 ${education.grade}` : ""}
            </p>

            {education.summary ? (
              <p className="mt-3 text-sm leading-relaxed text-blue-100/65">{education.summary}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection({
  projects,
  section,
}: {
  projects: PortfolioProject[];
  section: PortfolioSection;
}) {
  return (
    <section id={section.anchor} className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading section={section} />

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className={cn(PANEL, "flex flex-col gap-3")}>
            {project.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.imageUrl}
                alt={project.title}
                className="aspect-video w-full rounded-xl border border-white/10 object-cover"
              />
            ) : null}

            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              {project.isFeatured ? (
                <Star className="mt-1 size-4 shrink-0 fill-blue-300 text-blue-300" aria-label="Featured" />
              ) : null}
            </div>

            <p className="flex-1 text-sm leading-relaxed text-blue-100/65">
              {project.description}
            </p>

            {project.tags.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-blue-500/15 px-2 py-0.5 text-xs text-blue-200"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {project.liveUrl || project.githubUrl ? (
              <div className="flex gap-4 pt-1">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 hover:text-blue-200"
                  >
                    <ExternalLink className="size-3.5" />
                    Live site
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 hover:text-blue-200"
                  >
                    <Code className="size-3.5" />
                    Source
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

const LINK_ICONS = [
  { key: "github", label: "GitHub", icon: Code },
  { key: "linkedin", label: "LinkedIn", icon: Building },
  { key: "website", label: "Website", icon: Globe },
] as const;

export function ContactSection({
  owner,
  section,
}: {
  owner: PortfolioOwner;
  section: PortfolioSection;
}) {
  const links = LINK_ICONS.filter((link) => owner.links[link.key]);
  const heading = owner.settings.contact_heading ?? section.heading;
  const description = owner.settings.contact_description ?? section.description;

  return (
    <section id={section.anchor} className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading section={{ ...section, heading, description }} />

      <div className={cn(PANEL, "text-center")}>
        {heading ? (
          <h3 className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            {heading}
          </h3>
        ) : null}

        {description ? (
          <p className="mx-auto mt-3 max-w-md text-sm text-blue-100/60">{description}</p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {owner.email ? (
            <a href={`mailto:${owner.email}`} className={cn(buttonVariants({ size: "lg" }))}>
              <Mail data-icon="inline-start" />
              {owner.email}
            </a>
          ) : null}

          {links.map((link) => (
            <a
              key={link.key}
              href={owner.links[link.key]}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <link.icon />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioFooter({ text }: { text: string | undefined }) {
  if (!text) return null;

  return (
    <footer className="border-t border-white/10 py-8">
      <p className="text-center text-xs text-blue-200/40">{text}</p>
    </footer>
  );
}

export function PortfolioNav({
  sections,
  siteTitle,
  adminHref,
  adminLabel,
}: {
  sections: PortfolioSection[];
  siteTitle: string | undefined;
  adminHref: string;
  adminLabel: string;
}) {
  const navSections = sections.filter((section) => section.navLabel);

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#04081C]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-white">
          {siteTitle ?? ""}
        </Link>

        <nav className="flex items-center gap-1">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.anchor}`}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-100/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {section.navLabel}
            </a>
          ))}
        </nav>

        <Link
          href={adminHref}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {adminLabel}
        </Link>
      </div>
    </header>
  );
}
