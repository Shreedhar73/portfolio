export const profile = {
  name: "Shreedhar Pandeya",
  title: "Software Engineer — Mobile & Full-Stack",
  location: "Kathmandu, Nepal",
  email: "shreedharpandey000@gmail.com",
  github: "https://github.com/shreedhar73",
  playStore: "https://play.google.com/store/apps/details?id=com.onlyever",
};

export const roles = [
  "Flutter apps",
  "NestJS backends",
  "offline-first application",
  "generative AI features",
  "React/Next Js frontends",
  "apps people keep",
];

export const stats = [
  { value: "4+", label: "years shipping" },
  { value: "10+", label: "products in production" },
  { value: "10+", label: "app stores, zero rejections" },
  { value: "8", label: "local govts on one app" },
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
    role: "Full-stack developer · YoungInnovations · current",
    badge: "IN DEVELOPMENT",
    spotlight: true,
    accent: "rhodo",
    description:
      "Case management platform for UNFPA digitizing safehouse workflows for gender-based violence survivors in Nepal. Covers the full case lifecycle — consent, survivor intake, assessments, safety plans, referrals, follow-ups, and closure — behind role-based access across three privilege levels. Fully bilingual English/Nepali interface with an error-key contract so every API error maps to a localized, human message. Privacy-first by design.",
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
      "Subscription e-learning platform built around active review and recall. Millions of learning sources and curated courses, with AI-powered generation of learning cards, summaries, and practice materials. I own the offline-first Flutter app end to end — architecture, MongoDB-backed sync, flavors, releases, and store compliance on both platforms.",
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
    role: "Developer · deployed for 8 local governments",
    accent: "teal",
    description:
      "ICT support app for local bodies in Nepal. Citizens submit text or audio grievances to their local government and track status, with updates delivered by email. Built once, deployed for eight municipalities.",
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
    role: "Author · internal developer tools",
    accent: "rhodo",
    description:
      "npm packages that automate the boring parts — code generation, content generation, and scaffolding of recurring project components — so teams start features from a working baseline, not a blank file.",
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
      "Leading full-stack delivery of the UNFPA Safehouse case management platform — NestJS + Prisma + PostgreSQL backend, React (TypeScript) frontend, Clean Architecture with domain-driven modules and JWT auth.",
      "Designed a consent-driven, multi-step case intake workflow with step-wise API submission and unique case/survivor code generation with collision handling.",
      "Build and maintain production Flutter apps with Clean Architecture and Bloc; offline-first sync against MongoDB, real-time messaging via Firebase.",
      "Integrate generative AI into mobile products; advise clients on scope, capability, and limits.",
      "Adopted AI-assisted engineering workflows (Claude Code with custom project skills and agents) for scaffolding, review, and verification.",
      "Manage Google Play and App Store releases across multiple projects; mentor juniors and run code-review sessions.",
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
