export const profile = {
  name: "Shreedhar Pandeya",
  title: "Software Engineer & Technical Lead — Mobile & Full-Stack",
  location: "Kathmandu, Nepal",
  email: "shreedharpandey000@gmail.com",
  github: "https://github.com/shreedhar73",
  playStore: "https://play.google.com/store/apps/details?id=com.onlyever",
};

export const roles = [
  "Flutter apps",
  "NestJS backends",
  "offline-first applications",
  "generative AI features",
  "React/Next Js frontends",
  "teams that ship on time",
  "apps people keep",
];

export const stats = [
  { value: "4+", label: "years building & leading" },
  { value: "2", label: "platforms led end to end" },
  { value: "10+", label: "store releases, zero rejections" },
  { value: "8", label: "local govts on one codebase" },
];

export type Project = {
  name: string;
  role: string;
  badge?: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
  accent: "mango" | "rhodo" | "teal";
  spotlight?: boolean;
};

export const projects: Project[] = [
  {
    name: "UNFPA Safehouse Case Management",
    role: "Technical lead · full-stack delivery · YoungInnovations · current",
    badge: "IN DEVELOPMENT",
    spotlight: true,
    accent: "rhodo",
    description:
      "Case management platform for UNFPA digitizing safehouse workflows for gender-based violence survivors in Nepal. I lead full-stack delivery end to end — architecture, data model, API contract, and the roadmap calls in between. Covers the full case lifecycle — consent, survivor intake, assessments, safety plans, referrals, follow-ups, and closure — behind role-based access I designed across three privilege levels. Fully bilingual English/Nepali interface with an error-key contract so every API error maps to a localized, human message. Privacy-first by design, because for this product it was non-negotiable.",
    tags: [
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "React",
      "TypeScript",
      "i18next",
      "Zod",
    ],
    links: [],
  },
  {
    name: "OnlyEver",
    role: "Lead developer · YoungInnovations",
    badge: "LIVE",
    spotlight: true,
    accent: "mango",
    description:
      "Subscription e-learning platform built around active review and recall. Millions of learning sources and curated courses, with AI-powered generation of learning cards, summaries, and practice materials. I own the offline-first Flutter app end to end — architecture, MongoDB-backed sync, flavors, releases, and store compliance on both platforms — and the patterns I set are what the app is built on.",
    tags: [
      "Flutter",
      "Bloc",
      "MongoDB",
      "Firebase",
      "Generative AI",
      "Offline-first",
    ],
    links: [
      { label: "theonlyever.com", href: "https://www.theonlyever.com/" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.onlyever",
      },
    ],
  },
  {
    name: "नागरिक सहभागिता (Citizen Participation)",
    role: "Mobile developer · deployed for 8 local governments",
    accent: "teal",
    description:
      "ICT support app for local bodies in Nepal. Citizens submit text or audio grievances to their local government and track status, with updates delivered by email. One early decision — build it configurable, not bespoke — turned a single codebase into eight municipal deployments.",
    tags: ["Flutter", "Civic tech", "Audio", "Email notifications"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.ict_supprt.kapurkot",
      },
    ],
  },
  {
    name: "Municipal Association of Nepal",
    role: "Developer · client: MuAN",
    accent: "teal",
    description:
      "Mobile app for the association that advocates for Nepal’s municipalities. Publishes the decisions and interests of every member municipality — transparency as the product.",
    tags: ["Flutter", "Gov & advocacy"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=np.org.muannepal",
      },
    ],
  },
  {
    name: "Level Up (25hours Hotels)",
    role: "Developer · Miracle Interface",
    accent: "mango",
    description:
      "Invite-only app for a luxury hotel chain in Singapore, Malaysia, and Japan. Members order products, reserve dining and services, and catch flash sales. Stripe payments, multi-language, local caching.",
    tags: ["Flutter", "Stripe", "i18n"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=sg.app.levelup",
      },
    ],
  },
  {
    name: "Generation tooling (npm)",
    role: "Author · force multiplier for the team",
    accent: "rhodo",
    description:
      "npm packages I built to automate the boring parts — code generation, content generation, and scaffolding of recurring project components — so every engineer on the team starts features from a working baseline, not a blank file. Leadership, packaged as tooling.",
    tags: ["Node.js", "TypeScript", "Codegen"],
    links: [{ label: "GitHub", href: "https://github.com/shreedhar73" }],
  },
];

export type Job = {
  when: string;
  role: string;
  company: string;
  bullets: string[];
};

export const experience: Job[] = [
  {
    when: "Oct 2022 — Present",
    role: "Software Engineer II",
    company: "YoungInnovations",
    bullets: [
      "Lead full-stack delivery of the UNFPA Safehouse case management platform — I own the architecture (NestJS + Prisma + PostgreSQL backend, React + TypeScript frontend, Clean Architecture with domain-driven modules, JWT auth) and the technical decisions behind it.",
      "Designed the consent-driven, multi-step case intake workflow — step-wise API submission and unique case/survivor code generation with collision handling.",
      "Lead mobile development on OnlyEver: production Flutter with Clean Architecture and Bloc, offline-first sync against MongoDB, real-time messaging via Firebase.",
      "Advise clients directly on generative AI scope, capability, and limits — deciding what ships, what waits, and what gets cut.",
      "Introduced AI-assisted engineering workflows to the team (Claude Code with custom project skills and agents) for scaffolding, review, and verification.",
      "Own Google Play and App Store releases across multiple projects — versioning, compliance, rollout decisions. Zero rejections to date.",
      "Mentor junior engineers and run code-review sessions — raising the team's bar is part of the job, not a side quest.",
    ],
  },
  {
    when: "Feb 2022 — Sep 2022",
    role: "Mobile Engineer",
    company: "Miracle Interface",
    bullets: [
      "Built Flutter apps for Japanese clients with Stripe payments and Arduino-based IoT communication.",
      "Added multi-language support and local caching for broader, faster access.",
    ],
  },
  {
    when: "Dec 2021 — Jan 2022",
    role: "Software Engineering Intern",
    company: "Leapfrog Technology",
    bullets: [
      "Intensive front-end training (HTML, CSS, JavaScript, Git); built browser-based JavaScript games as capstone projects.",
    ],
  },
];

export const skills = [
  "Flutter",
  "Dart",
  "Bloc",
  "Clean Architecture",
  "Firebase",
  "React",
  "TypeScript",
  "TanStack",
  "Zod",
  "NestJS",
  "Prisma",
  "PostgreSQL",
  "MongoDB",
  "Node.js",
  "REST / OpenAPI",
  "JWT / RBAC",
  "SQLite",
  "Realm",
  "Qdrant",
  "AWS",
  "Generative AI",
  "Claude Code",
  "i18next",
  "Offline-first",
  "Release management",
  "Mentoring & code review",
  "Technical leadership",
];

export const education = [
  {
    degree: "BSc — Computer Science & Information Technology",
    school: "Madan Bhandari Memorial College · Tribhuvan University",
  },
  {
    degree: "High School (+2)",
    school: "DAV College, Jawalakhel",
  },
];
