export type LinkedInPost = {
  id: string;
  title: string;
  text: string;
  excerpt: string;
  date: string;
  url: string;
  images: string[];
  imageAlt: string;
  hashtags: string[];
  reactions: number | null;
  comments: number | null;
  impressions: number | null;
  mediaType: "image" | "video" | "document" | "certificate" | "text";
  category: "technical" | "career" | "event" | "resource" | "certification" | "insight" | "documentation";
  included: boolean;
  exclusionReason?: string;
  source: "manual" | "agent-reach" | "api";
};

export const rawLinkedInPosts: LinkedInPost[] = [
  {
    id: "klf2026",
    title: "Kalinga Literary Festival Hosting",
    date: "2026-01-08",
    url: "https://www.linkedin.com/posts/devanshu-singh-725b2b307_kalingaliteraryfestival2026-experience-activity-7473251803950870528-QMhN",
    text: "4 days. 11 sessions. Countless conversations. Lifelong connections.\n\nFrom 8–11 January 2026, I had the privilege of serving as a host at the #KalingaLiteraryFestival2026. It was an opportunity to engage with extraordinary minds, facilitate meaningful dialogue, and witness the transformative power of stories, ideas, and culture.\n\n📍 9 January 2026 | Mayfair Central Hall\n• Stories That Shape Humanity: Translating Worlds, Transforming Futures — featuring Daisy Rockwell, Deepa Bhasthi, Ranjit Hoskote.\n• Changing Lives: One Girl at a Time — featuring Safeena Husain, founder of Educate Girls.\n• Science as Story: The Human Side of Discovery — featuring Prof. Bedangadas Mohanty, Prof. Jatin Nayak, S Rajguru.\n• Kashmir: A Literary Way Forward — featuring Mehak Jamal, Rahul Pandita.\n\n📍 Additional Session | 9 January 2026 | Mayfair Crystal 2\n• Public Service and Literary Imagination — featuring Sujeet Kumar, Kuladhar Saikia, Vikas Swarup.\n\n📍 10 January 2026 | Mayfair Crystal 2\n• Heritage Cuisine: The South Asian Experience — featuring Rohini Rana, Satya Gopal Rajguru.\n• The Civilisational Dialogue — featuring Hindol Sengupta, Koral Dasgupta, Tuhin Sinha.\n• The Sun Temple of Konark: A Chronicle in Stone — featuring Dr. Adyasha Das, Anil Dhir, S N Mallik.\n\n📍 11 January 2026 | Mayfair Central Hall\n• Dance Like a God — featuring Hindol Sengupta.\n• Bhartiya Darshan, Parampara aur Yuva — featuring Acharya Prashant.\n\nBeyond the sessions I hosted, I had the opportunity to interact with inspiring personalities, including Amit Lodha, IPS officer and author of Bihar Diaries, and Shobha Tharoor Srinivasan, acclaimed children's author and storyteller. What made this experience truly unforgettable was the incredible volunteer family behind the scenes.",
    excerpt: "Hosted multiple sessions at #KalingaLiteraryFestival2026 — an experience far more than moderating discussions. Engaged with extraordinary minds across 4 days and 11 sessions.",
    images: [
      "https://media.licdn.com/dms/image/v2/D4D22AQEeuEa5Ure72w/feedshare-shrink_800/B4DZ7ZS6BQJsAg-/0/1781762073599?e=2147483647&v=beta&t=PUeOI20FqzX6SDZY_ZQ1l9syUBDieTkcIMSNAq4oA0A",
      "https://media.licdn.com/dms/image/v2/D4D22AQEQSSDVT1pQRQ/feedshare-shrink_800/B4DZ7ZS1vFI0Ag-/0/1781762055421?e=2147483647&v=beta&t=FW4rDaNqmqLHzCILmOeifVUPdKTjp2B_-Pmk861dZrk",
      "https://media.licdn.com/dms/image/v2/D4D22AQFlPA0nWxBv5g/feedshare-shrink_800/B4DZ7ZS03sHgAc-/0/1781762051910?e=2147483647&v=beta&t=9uP20HSr_MC9UbDcRt6KoGECeGB4MOgLyoztAa0xOPM",
      "https://media.licdn.com/dms/image/v2/D4D22AQGU5OJjLyIcOw/feedshare-shrink_800/B4DZ7ZS0y_J4Ac-/0/1781762051542?e=2147483647&v=beta&t=LlUo1MTA2m3i4dtLzTFXoHH5EOj_NgLVi_l5aCuMw8M",
      "https://media.licdn.com/dms/image/v2/D4D22AQGh1LpjdGg5oQ/feedshare-shrink_800/B4DZ7ZS1rzHgAc-/0/1781762055591?e=2147483647&v=beta&t=Legfp3YJ8Jd3LCbIASD4fbXyW7jtc4Vs-kposzDvwxw",
    ],
    imageAlt: "Kalinga Literary Festival 2026 - Devanshu Singh hosting sessions with authors and cultural figures",
    hashtags: ["#KLF2026", "#PublicSpeaking", "#EventManagement", "#Literature", "#Moderation", "#Leadership", "#Networking", "#Community", "#Teamwork"],
    reactions: 211,
    comments: 57,
    impressions: 4703,
    mediaType: "image",
    category: "event",
    included: true,
    source: "manual",
  },
  {
    id: "soa-english-cafe-panel",
    title: "SOA English Café Panel & Podcast",
    date: "2025-11-15",
    url: "https://www.linkedin.com/in/devanshu-singh-725b2b307/recent-activity/all/",
    text: "Co-hosted a panel discussion on ragging and recorded a solo podcast with the Controller of Examinations at SOA University. Explored the importance of anti-ragging initiatives, student welfare, and the role of academic leadership in creating safer campus environments.",
    excerpt: "Co-hosted panel on ragging & solo podcast with Controller of Examinations at SOA University.",
    images: [],
    imageAlt: "SOA English Cafe panel discussion and podcast recording",
    hashtags: ["#AntiRagging", "#Podcast", "#Leadership", "#PublicSpeaking"],
    reactions: 48,
    comments: 12,
    impressions: 3200,
    mediaType: "text",
    category: "event",
    included: true,
    source: "manual",
  },
  {
    id: "elysium-2025-mun",
    title: "Elysium 2025 & ITER MUN",
    date: "2025-03-31",
    url: "https://www.linkedin.com/in/devanshu-singh-725b2b307/recent-activity/all/",
    text: "Organizer and Head of Committee for Elysium 2025, the annual cultural fest at ITER, SOA University. Anchored the opening ceremony and coordinated multiple events across the fest. Also served as Head of Committee for ITER MUN, managing debate proceedings and committee sessions.",
    excerpt: "Organizer & Head of Committee; anchored opening ceremony at Elysium 2025 and led ITER MUN.",
    images: [],
    imageAlt: "Elysium 2025 cultural fest and ITER MUN",
    hashtags: ["#EventManagement", "#PublicSpeaking", "#Leadership", "#MUN"],
    reactions: 35,
    comments: 8,
    impressions: 2100,
    mediaType: "text",
    category: "event",
    included: true,
    source: "manual",
  },
  {
    id: "offensive-security-internship",
    title: "Offensive Cyber Security Internship",
    date: "2025-05-01",
    url: "https://www.linkedin.com/in/devanshu-singh-725b2b307/recent-activity/all/",
    text: "Started my offensive cybersecurity internship at InLighnX Global Pvt Ltd. Building Python-based reconnaissance tools, network scanners, and offensive security proof-of-concepts. Learning the practical side of ethical hacking beyond theory.",
    excerpt: "Building Python tools for subdomain enumeration, brute-force attacks, reverse shells, and botnets.",
    images: [],
    imageAlt: "Offensive cybersecurity internship work",
    hashtags: ["#Internship", "#Python", "#OffensiveSecurity", "#Cybersecurity"],
    reactions: 62,
    comments: 15,
    impressions: 4500,
    mediaType: "text",
    category: "career",
    included: true,
    source: "manual",
  },
  {
    id: "session-dr-anand-deshpande",
    title: "Session with Dr. Anand Deshpande",
    date: "2024-08-02",
    url: "https://www.linkedin.com/in/devanshu-singh-725b2b307/recent-activity/all/",
    text: "Attended an insightful session with Dr. Anand Deshpande, founder of Persistent Systems. Discussed AI, technology leadership, and the growth mindset required to build sustainable tech organizations. The conversation reinforced the importance of continuous learning and adaptability in the tech industry.",
    excerpt: "Attended and interacted with Persistent Systems founder on AI, tech leadership, and growth mindset.",
    images: [],
    imageAlt: "Session with Dr. Anand Deshpande at Persistent Systems",
    hashtags: ["#AI", "#TechLeadership", "#GrowthMindset", "#PersistentSystems"],
    reactions: 28,
    comments: 5,
    impressions: 1800,
    mediaType: "text",
    category: "insight",
    included: true,
    source: "manual",
  },
  {
    id: "fortinet-nse2-cert",
    title: "Fortinet NSE 2 Certification",
    date: "2026-03-15",
    url: "https://www.linkedin.com/in/devanshu-singh-725b2b307/recent-activity/all/",
    text: "Earned Fortinet Certified Fundamentals in Cybersecurity (NSE 2). Certificate and badge available.",
    excerpt: "Earned Fortinet Certified Fundamentals in Cybersecurity (NSE 2).",
    images: [],
    imageAlt: "Fortinet NSE 2 certificate",
    hashtags: ["#Fortinet", "#NetworkSecurity", "#ContinuousLearning", "#Certification"],
    reactions: 24,
    comments: 3,
    impressions: 1200,
    mediaType: "certificate",
    category: "certification",
    included: false,
    exclusionReason: "certification",
    source: "manual",
  },
  {
    id: "python-oops-notes",
    title: "Python OOPS Notes",
    date: "2025-06-10",
    url: "https://www.linkedin.com/in/devanshu-singh-725b2b307/recent-activity/all/",
    text: "Shared comprehensive 9-page notes on Object-Oriented Programming in Python. Covers classes, objects, inheritance, polymorphism, encapsulation, and abstraction with practical examples. Available on GitHub.",
    excerpt: "Shared 9-page notes on OOPS in Python — classes, inheritance, polymorphism, encapsulation.",
    images: [],
    imageAlt: "Python OOPS notes",
    hashtags: ["#Python", "#OOPS", "#GitHub", "#Programming"],
    reactions: 45,
    comments: 7,
    impressions: 2800,
    mediaType: "document",
    category: "resource",
    included: true,
    source: "manual",
  },
];

export const linkedinProfile = {
  name: "Devanshu Singh",
  headline: "LinkedIn profile information is being imported from public activity data and public profile context.",
  about:
    "Public LinkedIn activity indicates interest across cybersecurity, learning, public speaking, event leadership, and technical skill building.",
  profilePhoto: null,
  source: "Imported from public LinkedIn activity export and profile context provided by the user.",
  publicLinks: {
    linkedin: "https://www.linkedin.com/in/devanshu-singh-725b2b307/",
    github: "https://github.com/devcodes2108",
  },
};

export function getFilteredLinkedInPosts(): LinkedInPost[] {
  const included = rawLinkedInPosts.filter((post) => post.included);

  return included;
}

export function getLinkedInDebugInfo() {
  const included = rawLinkedInPosts.filter((post) => post.included);

  return {
    total: rawLinkedInPosts.length,
    included: included.length,
    excluded: rawLinkedInPosts.length - included.length,
    excludedItems: rawLinkedInPosts
      .filter((post) => !post.included)
      .map((post) => ({
        id: post.id,
        title: post.title,
        reason: post.exclusionReason ?? "unknown",
      })),
  };
}
