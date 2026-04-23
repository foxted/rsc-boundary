export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: { name: string; initials: string };
  date: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
}

export const articles: Article[] = [
  {
    id: "rsc-mental-model",
    title: "The Mental Model You Need for React Server Components",
    excerpt:
      "RSC blurs the line between server and client rendering. Here's how to think about data flow, boundaries, and the 'use client' directive to build faster apps with less JavaScript.",
    author: { name: "Jordan Ellis", initials: "JE" },
    date: "Apr 18, 2026",
    readTime: 8,
    tags: ["React", "RSC", "Architecture"],
    featured: true,
  },
  {
    id: "turbopack-retrospective",
    title: "Turbopack in Production: A Six-Month Retrospective",
    excerpt:
      "After migrating a large Next.js monorepo to Turbopack, we collected benchmarks, surprises, and hard-won lessons worth sharing with the community.",
    author: { name: "Maya Chen", initials: "MC" },
    date: "Apr 16, 2026",
    readTime: 12,
    tags: ["Next.js", "Performance", "DX"],
  },
  {
    id: "vitest-browser-mode",
    title: "Vitest Browser Mode Is Ready for Real Work",
    excerpt:
      "The browser mode in Vitest 3 is no longer experimental. We compare it head-to-head with Playwright and JSDOM for real-world component testing scenarios.",
    author: { name: "Sam Park", initials: "SP" },
    date: "Apr 14, 2026",
    readTime: 6,
    tags: ["Testing", "Vitest"],
  },
  {
    id: "signals-vs-atoms",
    title: "Signals vs Atoms: Which Fine-Grained State Pattern Wins?",
    excerpt:
      "A practical comparison of Preact Signals, Jotai atoms, and Zustand stores in a real-world dashboard with 200+ reactive cells. Numbers included.",
    author: { name: "Alex Rivera", initials: "AR" },
    date: "Apr 11, 2026",
    readTime: 10,
    tags: ["State", "Performance"],
  },
  {
    id: "css-cascade-layers",
    title: "CSS Cascade Layers Finally Click — Here's Why",
    excerpt:
      "If you've been skipping @layer, this is the explainer that makes it stick. Real use-cases with before/after specificity diagrams and migration tips.",
    author: { name: "Priya Nair", initials: "PN" },
    date: "Apr 9, 2026",
    readTime: 7,
    tags: ["CSS", "Web Standards"],
  },
  {
    id: "partial-prerender",
    title: "Partial Prerendering: The Architecture Shift You've Been Waiting For",
    excerpt:
      "PPR in Next.js lets you combine static shells with dynamic streaming content at the route level. Here's everything you need to know to adopt it today.",
    author: { name: "Jordan Ellis", initials: "JE" },
    date: "Apr 7, 2026",
    readTime: 9,
    tags: ["Next.js", "RSC", "Performance"],
  },
];

export const featuredArticle = articles[0]!;
export const gridArticles = articles.slice(1);

export const siteStats = {
  articles: "1,847",
  readers: "52K",
  bookmarks: "8.3K",
};

export const teamMembers = [
  { name: "Jordan Ellis", role: "Editor in Chief", initials: "JE", color: "#c7d2fe" },
  { name: "Maya Chen", role: "Staff Writer", initials: "MC", color: "#d1fae5" },
  { name: "Sam Park", role: "DX Engineer", initials: "SP", color: "#fde68a" },
  { name: "Priya Nair", role: "Design Lead", initials: "PN", color: "#fce7f3" },
];

export const techStack = [
  { emoji: "⚛️", name: "React 19", desc: "Server & client rendering" },
  { emoji: "▲", name: "Next.js App Router", desc: "File-based routing + RSC" },
  { emoji: "🔷", name: "TypeScript", desc: "Strict mode throughout" },
  { emoji: "🗄️", name: "PostgreSQL", desc: "Hosted on Supabase" },
  { emoji: "🎨", name: "CSS Cascade Layers", desc: "Zero-dependency styling" },
  { emoji: "🚀", name: "Turbopack", desc: "Sub-second HMR" },
];

export const faqs = [
  {
    id: "what-is-rsc",
    question: "What are React Server Components?",
    answer:
      "React Server Components (RSC) let you render components on the server only, sending HTML to the client without shipping any JavaScript for those components. This means smaller bundles and faster initial loads — especially for content-heavy pages.",
  },
  {
    id: "rsc-vs-ssr",
    question: "How is RSC different from SSR?",
    answer:
      "Traditional SSR renders everything on the server once, then re-hydrates all of it on the client. RSC is more granular: only the components marked 'use client' get hydrated. Server components exist purely as HTML in the client's React tree — no fibers, no JS.",
  },
  {
    id: "use-client",
    question: "When should I add 'use client'?",
    answer:
      "Only when a component needs interactivity (event handlers), browser-only APIs, or React hooks like useState and useEffect. Everything else — data fetching, layout, static content — can stay as a server component and ship zero client JavaScript.",
  },
  {
    id: "rsc-boundary",
    question: "What does RSC Boundary do exactly?",
    answer:
      "RSC Boundary walks the live React fiber tree in your browser and highlights which parts of the page are true server components (no fiber) versus client components (have a fiber). It's a devtool overlay that makes the boundary visually obvious during development.",
  },
];
