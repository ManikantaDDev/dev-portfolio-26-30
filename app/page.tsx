import Link from "next/link";
import {
  experiences,
  profile,
  projects,
  publishedProjects,
  sections,
  skills,
} from "@/lib/demo/portfolio-data";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function Home() {
  const visible = [...sections].sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleNames = new Set(visible.filter((s) => s.isVisible).map((s) => s.name));

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-medium text-muted-foreground">{profile.role}</p>

          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            {profile.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{profile.bio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {publishedProjects.slice(0, 2).map((project) => (
              <Link
                key={project.id}
                href="#projects"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {project.title}
              </Link>
            ))}

            <Link
              href="#contact"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Get in touch
            </Link>
          </div>
        </section>

        {visibleNames.has("about") ? (
          <section id="about" className="border-t border-border">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <h2 className="text-2xl font-semibold">About</h2>

              <dl className="mt-6 grid gap-6 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd className="mt-1 font-medium">{profile.name}</dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">Role</dt>
                  <dd className="mt-1 font-medium">{profile.role}</dd>
                </div>

                <div>
                  <dt className="text-sm text-muted-foreground">Location</dt>
                  <dd className="mt-1 font-medium">{profile.location}</dd>
                </div>
              </dl>
            </div>
          </section>
        ) : null}

        {visibleNames.has("skills") ? (
          <section id="skills" className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <h2 className="text-2xl font-semibold">Skills</h2>

              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>

                    <div
                      role="meter"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={skill.name}
                      className="mt-2 h-2 overflow-hidden rounded-full bg-border"
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {visibleNames.has("experience") ? (
          <section id="experience" className="border-t border-border">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <h2 className="text-2xl font-semibold">Experience</h2>

              <ol className="mt-6 space-y-8">
                {experiences.map((experience) => (
                  <li key={`${experience.company}-${experience.title}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-medium">{experience.title}</h3>
                      <p className="text-sm text-muted-foreground">{experience.period}</p>
                    </div>

                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {experience.company}
                    </p>

                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      {experience.summary}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {visibleNames.has("projects") ? (
          <section id="projects" className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <h2 className="text-2xl font-semibold">Projects</h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {publishedProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-lg border border-border bg-background p-5"
                  >
                    <h3 className="text-lg font-medium">{project.title}</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex items-center gap-4 text-sm">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          className="font-medium underline underline-offset-4"
                        >
                          Live site
                        </a>
                      ) : null}

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          className="text-muted-foreground underline underline-offset-4"
                        >
                          Source
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                {publishedProjects.length} of {projects.length} projects published.
              </p>
            </div>
          </section>
        ) : null}

        {visibleNames.has("contact") ? (
          <section id="contact" className="border-t border-border">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <h2 className="text-2xl font-semibold">Contact</h2>

              <ul className="mt-6 flex flex-wrap gap-6">
                {profile.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      className="text-sm underline underline-offset-4"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>

      <PublicFooter name={profile.name} note="Built with Next.js and Supabase." />
    </div>
  );
}
