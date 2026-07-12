export const stops = [
  { id: "top", label: "This Is Joseph" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "connect", label: "Connect" },
  { id: "corner", label: "Content Corner" },
];

export const services = [
  {
    n: "01",
    title: "Web Development & Design",
    desc: "Custom-built, responsive websites and product interfaces — from first wireframe to production-ready code.",
    tags: ["UI/UX", "Front-End", "Full-Stack", "E-commerce"],
  },
  {
    n: "02",
    title: "Web Content Management",
    desc: "Ongoing management of CMS platforms, content structure, SEO hygiene, and site performance so your site stays sharp long after launch.",
    tags: ["CMS", "SEO", "Copy Ops", "Maintenance"],
  },
  {
    n: "03",
    title: "Web Consulting",
    desc: "Strategic audits and roadmaps for brands that need clarity on platform choice, architecture, and digital growth.",
    tags: ["Strategy", "Audits", "Architecture"],
  },
  {
    n: "04",
    title: "Social Media Management",
    desc: "Full-service content calendars, community management, and platform strategy that turns followers into customers.",
    tags: ["Instagram", "TikTok", "LinkedIn", "Strategy"],
  },
  {
    n: "05",
    title: "Content Creation",
    desc: "Photo, video, and written content produced end-to-end — built to perform across web and social from day one.",
    tags: ["Video", "Copywriting", "Photography"],
  },
];

// Live screenshots of each site via the free thum.io service
const shot = (url: string) => `https://image.thum.io/get/width/800/crop/600/${url}`;

// Curated award-winning references — swap these with your own client
// projects before pitching; they are benchmarks, not Joseph's builds.
export const work = [
  { title: "Igloo Inc", category: "Awwwards Site of the Year · WebGL", url: "https://igloo.inc", image: shot("https://igloo.inc") },
  { title: "Lusion", category: "Creative Studio · Multi-Award Winner", url: "https://lusion.co", image: shot("https://lusion.co") },
  { title: "Active Theory", category: "Interactive · FWA & Webby Winner", url: "https://activetheory.net", image: shot("https://activetheory.net") },
  { title: "Locomotive", category: "Agency Site · Awwwards Winner", url: "https://locomotive.ca", image: shot("https://locomotive.ca") },
  { title: "Obys Agency", category: "Typography-Led · Awwwards Winner", url: "https://obys.agency", image: shot("https://obys.agency") },
  { title: "Linear", category: "Product Site Benchmark", url: "https://linear.app", image: shot("https://linear.app") },
];

export const process = [
  { n: "01", title: "Discover", desc: "We map goals, audience, and constraints before a single pixel moves." },
  { n: "02", title: "Design", desc: "Interfaces and content systems built around your brand, not a template." },
  { n: "03", title: "Build", desc: "Clean, fast, maintainable code — shipped, tested, and documented." },
  { n: "04", title: "Grow", desc: "Ongoing content, management, and optimization that compounds over time." },
];

// Placeholder quotes — replace with real client words before launch
export const testimonials = [
  {
    quote: "Joseph rebuilt our site and our social presence in the same month. Traffic and inquiries both doubled within a quarter.",
    name: "Amara Reyes",
    role: "Startup Founder",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    quote: "The rare combination of a developer who designs, writes, and actually understands how content drives growth.",
    name: "David Kwan",
    role: "Marketing Lead",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    quote: "Consistent, reliable, and sharp with strategy. Joseph is now our go-to for anything web or content related.",
    name: "Priya Nair",
    role: "Small Business Owner",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X / Twitter", href: "https://x.com" },
  { label: "Behance", href: "https://behance.net" },
];
