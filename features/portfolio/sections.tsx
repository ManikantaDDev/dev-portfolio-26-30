import Link from "next/link";
import {
  ArrowRight,
  Building,
  Code,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { PortfolioOwner, PortfolioProject } from "@/portfolio/config/sections";
import { cn } from "cn";

const PANEL =
  "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_32px_rgba(2,6,23,0.45)] backdrop-blur-md sm:p-8";

const SECTION_TITLE =
  "bg-gradient-to-r from-blue-300 via-sky-200 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl";

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/80">{eyebrow}</p>
      <h2 className={SECTION_TITLE}>{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-blue-100/60">{description}</p>
      ) : null}
    </div>
  );
}

export function HeroSection({ owner }: { owner: PortfolioOwner }) {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      {/* pointer-events-none so dragging a star through the text still works */}
      <div className="pointer-events-none mx-auto w-full max-w-3xl text-center">
        <div className="pointer-events-none inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-200">
          <span className="size-1.5 animate-pulse rounded-full bg-blue-300" />
          Available for new projects
        </div>

        <h1 className="mt-6 bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-5xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-7xl">
          {owner.name}
        </h1>

        <p className="mt-4 text-lg font-medium text-blue-200/90 sm:text-xl">{owner.headline}</p>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-blue-100/60 sm:text-base">
          {owner.bio}
        </p>

        <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#projects" className={cn(buttonVariants({ size: "lg" }))}>
            View my work
            <ArrowRight data-icon="inline-end" />
          </a>
          <a
            href="#contact"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Get in touch
          </a>
        </div>

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

export function AboutSection({ owner }: { owner: PortfolioOwner }) {
  return (
    <section id="about" className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow="About"
        title="A little about me"
        description={owner.headline}
      />

      <div className={cn(PANEL, "grid gap-8 sm:grid-cols-[1.6fr_1fr]")}>
        <div className="space-y-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-blue-50/80">{owner.bio}</p>
        </div>

        <dl className="space-y-4 border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div>
            <dt className="text-xs uppercase tracking-wider text-blue-200/50">Name</dt>
            <dd className="mt-1 text-sm font-medium text-white">{owner.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-blue-200/50">Role</dt>
            <dd className="mt-1 text-sm font-medium text-white">{owner.headline}</dd>
          </div>
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

export function SkillsSection({ owner }: { owner: PortfolioOwner }) {
  const grouped = owner.skills.reduce<Record<string, typeof owner.skills>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        description="Technologies and tools I reach for most often."
      />

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
                  {skill.is_featured ? (
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

export function ProjectsSection({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  return (
    <section id="projects" className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="A few things I have built and shipped."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className={cn(PANEL, "flex flex-col gap-3")}>
            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
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

export function ContactSection({ owner }: { owner: PortfolioOwner }) {
  const links = LINK_ICONS.filter((link) => owner.links[link.key]);

  return (
    <section id="contact" className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Let&apos;s build something"
        description="Have a project in mind? My inbox is open."
      />

      <div className={cn(PANEL, "text-center")}>
        <h3 className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Let&apos;s build something
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-blue-100/60">
          Whether it&apos;s a full product or a single feature, send a message and I&apos;ll get
          back to you.
        </p>

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

          {!owner.email && links.length === 0 ? (
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Sign in to add your contact details
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8">
      <p className="text-center text-xs text-blue-200/40">
        Built with Next.js, Tailwind CSS and Supabase.
      </p>
    </footer>
  );
}