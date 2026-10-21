export type Settings = {
  id: string;
  companyName: string;
  tagline: string;
  aboutSubtitle: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  years: number;
  projectsCount: number;
  clientsCount: number;
  qualifications: string;
  logo: string;
  collectionId: string;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  body: string;
  sort: number;
  cover: string;
  published: boolean;
  collectionId: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  location: string;
  client: string;
  summary: string;
  body: string;
  cover: string;
  featured: boolean;
  published: boolean;
  collectionId: string;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  publishedAt: string;
  cover: string;
  published: boolean;
  collectionId: string;
};

export type Milestone = {
  id: string;
  year: number;
  title: string;
  description: string;
};
