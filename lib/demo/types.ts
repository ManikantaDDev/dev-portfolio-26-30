export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  isPublished: boolean;
  stars: number;
  imageUrl?: string | null;
  publishedAt?: Date | null;
};

export type Skill = {
  name: string;
  level: number;
};

export type Experience = {
  company: string;
  title: string;
  period: string;
  summary: string;
};

export type Section = {
  name: string;
  title: string;
  isVisible: boolean;
  displayOrder: number;
};
