/**
 * Site-wide settings, stored as key/value rows in `portfolio_settings`.
 *
 * The list below is configuration metadata (labels, which input to render),
 * not content: every value the portfolio shows is read from the database.
 */
export type SiteSettingField =
  | "text"
  | "textarea"
  | "url";

export type SiteSettingDef = {
  key: string;
  label: string;
  field: SiteSettingField;
  helpText: string;
  placeholder: string;
  rows?: number;
};

export const SITE_SETTINGS: SiteSettingDef[] = [
  {
    key: "site_title",
    label: "Site Title",
    field: "text",
    helpText: "Shown in the browser tab and used as the header wordmark fallback.",
    placeholder: "My Portfolio",
  },
  {
    key: "site_description",
    label: "Meta Description",
    field: "textarea",
    rows: 3,
    helpText: "Used for the page description and link previews.",
    placeholder: "Full-stack developer building fast, accessible web products.",
  },
  {
    key: "hero_badge",
    label: "Hero Badge",
    field: "text",
    helpText: "Small pill above your name. Leave blank to hide it.",
    placeholder: "Available for new projects",
  },
  {
    key: "hero_cta_label",
    label: "Hero Button Label",
    field: "text",
    helpText: "Label for the primary button in the hero. Leave blank to hide it.",
    placeholder: "View my work",
  },
  {
    key: "contact_heading",
    label: "Contact Heading",
    field: "text",
    helpText: "Heading shown in the contact section.",
    placeholder: "Let's build something",
  },
  {
    key: "contact_description",
    label: "Contact Description",
    field: "textarea",
    rows: 3,
    helpText: "Short paragraph shown under the contact heading.",
    placeholder: "Whether it's a full product or a single feature, send a message and I'll get back to you.",
  },
  {
    key: "resume_url",
    label: "Resume URL",
    field: "url",
    helpText: "Adds a download link to the hero. Leave blank to hide it.",
    placeholder: "https://example.com/resume.pdf",
  },
  {
    key: "footer_text",
    label: "Footer Text",
    field: "text",
    helpText: "Leave blank to hide the footer entirely.",
    placeholder: "Built with Next.js, Tailwind CSS and Supabase.",
  },
];

export const SITE_SETTING_KEYS = SITE_SETTINGS.map((setting) => setting.key);

/** Key holding the uuid of the account whose portfolio is published. */
export const OWNER_SETTING_KEY = "owner_id";

/**
 * Sections seeded for a brand new portfolio. Once claimed these rows are
 * edited from the admin panel, never re-seeded.
 */
export const DEFAULT_SECTIONS: {
  name: string;
  label: string | null;
  display_order: number;
}[] = [
  { name: "hero", label: null, display_order: 0 },
  { name: "about", label: "About", display_order: 1 },
  { name: "skills", label: "Skills", display_order: 2 },
  { name: "experience", label: "Experience", display_order: 3 },
  { name: "projects", label: "Projects", display_order: 4 },
  { name: "contact", label: "Contact", display_order: 5 },
];
