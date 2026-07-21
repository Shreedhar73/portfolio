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
    name: "OnlyEver",
    role: "Lead developer · YoungInnovations · current",
    badge: "LIVE · EXPANDING",
    spotlight: true,
    accent: "mango",
    description:
      "Subscription e-learning platform built around active review and recall. Millions of learning sources and curated courses, with AI-powered generation of learning cards, summaries, and practice materials. I own the offline-first Flutter app end to end — architecture, MongoDB-backed sync, flavors, releases, and store compliance on both platforms — and the patterns I set are what the app is built on. Currently leading the ongoing work: expanding the feature set and continuously improving the product in production.",
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
    name: "Label STEP — Weaver Management",
    role: "Development lead · client: Label STEP · YoungInnovations",
    accent: "teal",
    description:
      "Weaver management platform for Label STEP, the fair-trade NGO that has worked in the hand-knotted carpet industry since 1995. As development lead I owned the mobile build — a communications tool linking weavers, manufacturers, and distributors across Nepal's Artisan Villages, streamlining the day-to-day coordination of the craft.",
    tags: ["Flutter", "Fair trade", "Offline-first"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.labelstep.wms",
      },
    ],
  },
  {
    name: "Susasan — Local Governance apps",
    role: "Developer · one codebase · 12+ municipal deployments",
    accent: "teal",
    description:
      "Good-governance app family for Nepal's local governments — Parshuram Nagarpalika is one of 12+ municipalities (Bagmati, Bheri, and more) running on the same codebase. Each app puts municipal notices, services, policies, and maps in one place and routes citizen grievances and feedback to the right official. One build, shipped as a separate branded app per municipality using Flutter flavors.",
    tags: ["Flutter", "Flavors", "Civic tech", "Governance"],
    links: [
      {
        label: "Parshuram (Google Play)",
        href: "https://play.google.com/store/apps/details?id=org.susasan.parshuram",
      },
    ],
  },
  {
    name: "ESCR Monitoring",
    role: "Developer · maintenance · human rights",
    accent: "teal",
    description:
      "Monitoring platform for human rights practitioners, researchers, and enthusiasts to learn about people's Economic, Social and Cultural Rights (ESCR) and how they link to the Sustainable Development Goals. Users can monitor chosen locations across Nepal to assess how ESCR rights are being implemented on the ground. I maintain the production app across store releases.",
    tags: ["Flutter", "Human rights", "SDGs", "Monitoring"],
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.cahurastnepal.escrapp",
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

export const ai = {
  kicker: "AI · workflow to feature",
  headline: "AI that ships — standardized workflows, real features, tested.",
  intro:
    "AI is core to how I work and what I build. I set the team's AI engineering standards, then use the same rigor to put generative features into production — fast, reliable, and well-tested, not demos that fall over.",
  tracks: [
    {
      title: "AI-standardized engineering",
      body: "I set up and standardize AI-assisted development across the team — Claude Code with custom project skills, agents, and review workflows — so scaffolding, code generation, and verification are consistent and repeatable. Leadership, encoded as tooling.",
      tags: ["Claude Code", "Custom skills & agents", "Codegen", "Automated review"],
    },
    {
      title: "Generative features in production",
      body: "Shipped generative-AI features that earn their place — content generation, summaries, and learning-card / practice-material generation from raw sources — wired into real apps with guardrails and fallbacks, not throwaway prototypes.",
      tags: ["Content generation", "Summarization", "LLM orchestration", "Guardrails"],
    },
    {
      title: "RAG & vector search",
      body: "Retrieval-augmented generation and semantic search over real corpora — embeddings, vector stores, chunking and retrieval pipelines that ground answers in the user's own data instead of hallucinating.",
      tags: ["RAG", "Embeddings", "Qdrant", "Semantic search"],
    },
  ],
  promise:
    "Fast, reliable, well-tested. I ship AI features at speed without shipping slop — typed contracts, tests, and evals so behavior stays predictable and regressions get caught before users do.",
};

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
      "Lead mobile development on OnlyEver — a live AI-powered e-learning platform — owning the production Flutter app (Clean Architecture, Bloc, offline-first sync against MongoDB, real-time messaging via Firebase). Currently expanding the feature set and continuously improving the product in production.",
      "Own the mobile architecture and technical decisions behind OnlyEver end to end — flavors, releases, and store compliance across both platforms — and set the patterns the app is built on.",
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
