import type { Project, Skill, Experience, Section } from "@/lib/demo/types";

export const profile = {
  name: "Manik",
  role: "Full-Stack Developer",
  headline: "I build fast, accessible web products end to end.",
  bio: "I work across the stack — database design, API contracts, and the interface layer — with a focus on shipping things that stay maintainable after the first release.",
  location: "Bengaluru, India",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
};

export const sections: Section[] = [
  { name: "about", title: "About", isVisible: true, displayOrder: 1 },
  { name: "skills", title: "Skills", isVisible: true, displayOrder: 2 },
  { name: "experience", title: "Experience", isVisible: true, displayOrder: 3 },
  { name: "projects", title: "Projects", isVisible: true, displayOrder: 4 },
  { name: "contact", title: "Contact", isVisible: true, displayOrder: 5 },
];

export const skills: Skill[] = [
  { name: "TypeScript", level: 90 },
  { name: "React / Next.js", level: 88 },
  { name: "Node.js", level: 82 },
  { name: "PostgreSQL", level: 78 },
  { name: "Tailwind CSS", level: 85 },
  { name: "Docker", level: 70 },
];

export const experiences: Experience[] = [
  {
    company: "Northwind Labs",
    title: "Senior Software Engineer",
    period: "2023 — Present",
    summary:
      "Lead the web platform team. Cut p95 latency by migrating read paths to a caching layer.",
  },
  {
    company: "Bright Harbor",
    title: "Software Engineer",
    period: "2021 — 2023",
    summary:
      "Built internal tooling used by 40+ engineers, replacing a set of brittle shell scripts.",
  },
  {
    company: "Freelance",
    title: "Web Developer",
    period: "2019 — 2021",
    summary:
      "Delivered marketing sites and small web apps for clients across retail and education.",
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Portfolio Platform",
    description:
      "A content-managed developer portfolio backed by Postgres with row-level security for admin editing.",
    tags: ["Next.js", "Postgres", "Tailwind"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    isPublished: true,
    stars: 42,
  },
  {
    id: "p2",
    title: "Realtime Notes",
    description:
      "Collaborative markdown editor with conflict-free sync and offline editing via a local queue.",
    tags: ["React", "WebSocket", "IndexedDB"],
    liveUrl: null,
    githubUrl: "https://github.com",
    isPublished: true,
    stars: 128,
  },
  {
    id: "p3",
    title: "Query Visualizer",
    description:
      "Tool that explains slow SQL execution plans and suggests index changes.",
    tags: ["Node.js", "SQL"],
    liveUrl: null,
    githubUrl: null,
    isPublished: false,
    stars: 0,
  },
  {
    id: "p4",
    title: "Design Tokens CLI",
    description:
      "Generates typed token packages for web and native platforms from a single source file.",
    tags: ["TypeScript", "CLI"],
    liveUrl: "https://example.com/tokens",
    githubUrl: "https://github.com",
    isPublished: true,
    stars: 67,
  },
];

export const publishedProjects = projects.filter((project) => project.isPublished);
