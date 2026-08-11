export type SocialLink = {
  label: string;
  href: string;
};

export type SkillCategory = {
  title: string;
  items: string[];
};

export type GitHubProjectSummary = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export type PortfolioProfile = {
  name: string;
  headline: string;
  introduction: string;
  github: string;
  linkedin: string;
  experienceUrl: string;
  certificationsUrl: string;
  location: string;
  photo?: string | null;
  aboutParagraphs: string[];
};

export type ExperienceRole = {
  title: string;
  period: string;
  mode?: string;
};

export type ExperienceHighlight = {
  organization: string;
  title: string;
  engagement: string;
  period: string;
  location: string;
  href: string;
  roles?: ExperienceRole[];
  details: string[];
  skills: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  href: string;
  skills: string[];
  notes?: string;
  issuerLogo?: string | null;
};

export const profile: PortfolioProfile = {
  name: "Devanshu Singh",
  headline: "B.Tech CSE cybersecurity student, offensive-security learner, public speaker, and Python builder.",
  introduction:
    "I combine cybersecurity fundamentals, software projects, and communication-led leadership to build secure, useful, and clearly explained digital work.",
  github: "https://github.com/devcodes2108",
  linkedin: "https://www.linkedin.com/in/devanshu-singh-725b2b307/",
  experienceUrl: "https://www.linkedin.com/in/devanshu-singh-725b2b307/details/experience/",
  certificationsUrl: "https://www.linkedin.com/in/devanshu-singh-725b2b307/details/certifications/",
  location: "Bhubaneswar, Odisha, India",
  photo: "/WhatsApp Image 2026-08-11 at 2.58.19 AM (1).jpeg",
  aboutParagraphs: [
    "As a B.Tech student at SOA University specializing in Cyber Security within Computer Science and Engineering, I am passionate about safeguarding digital landscapes and mitigating cyber threats. My academic journey has equipped me with a robust understanding of cybersecurity principles, threat analysis, and defensive strategies.",
    "Beyond my technical expertise, I am an avid public speaker and debater who enjoys engaging in discussions across a wide range of topics. I am also a Python enthusiast, and I enjoy the challenge of working on diverse software projects both within and outside cybersecurity.",
    "This blend of technical acumen and effective communication helps me explain complex cybersecurity concepts to diverse audiences while building a culture of security awareness. I am eager to connect with professionals and organizations that value innovation, security, and continuous learning.",
  ],
};

export const skillGroups: SkillCategory[] = [
  {
    title: "Core engineering",
    items: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "C", "C++"],
  },
  {
    title: "Cybersecurity practice",
    items: ["Cybersecurity fundamentals", "Ethical hacking", "Threat analysis", "Network security", "Nmap", "Kali Linux", "Secure SD-WAN"],
  },
  {
    title: "Communication craft",
    items: ["Public speaking", "Debating", "Public relations", "Content management", "Presentation skills", "Customer support"],
  },
];

export const focusAreas = [
  "Cyber Security student",
  "Python enthusiast",
  "Public speaker and debater",
  "Threat analysis and defensive strategy",
  "Security awareness communication",
];

export const navigation = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Posts", href: "#posts" },
  { label: "Contact", href: "#contact" },
];

export const experienceHighlights: ExperienceHighlight[] = [
  {
    organization: "SOA English Cafe",
    title: "Executive Lead, Public Relations and Core Member",
    engagement: "Part-time",
    period: "Apr 2024-May 2026",
    location: "Bhubaneswar, Odisha, India",
    href: profile.experienceUrl,
    roles: [
      { title: "Executive Lead", period: "Mar 2026-May 2026", mode: "Hybrid" },
      { title: "Head of Public Relations", period: "May 2025-May 2026", mode: "Hybrid" },
      { title: "Core Member", period: "Jul 2024-May 2025" },
      { title: "Member", period: "Apr 2024-Jul 2024", mode: "Hybrid" },
    ],
    details: [
      "Led and supported SOA English Cafe initiatives across public speaking, content editing, content management, and public relations.",
      "Communicated ideas clearly, engaged audiences during events, and contributed to communication-led student programming.",
      "Built experience in presentations, public relations, leadership, audience engagement, and collaborative event execution.",
    ],
    skills: ["Presentations", "Public Relations", "Public Speaking", "Content Management", "Content Editing", "Leadership"],
  },
  {
    organization: "InLighnX Global Pvt Ltd (InLighn Tech)",
    title: "Offensive Cyber Security Intern",
    engagement: "Internship",
    period: "May 2025-Dec 2025",
    location: "India",
    href: profile.experienceUrl,
    details: [
      "Built Python-based reconnaissance and network security tools including subdomain enumeration, DNS discovery, ARP scanning, and TCP port scanning.",
      "Developed password, SSH, FTP, and PDF cracking tools for brute-force and dictionary-based authentication-strength testing.",
      "Created a PDF protection utility with strong passwords, multi-file encryption, and improved user interaction.",
      "Built offensive-security PoCs including reverse shell remote command execution, file transfer, system and clipboard data extraction, and SSH botnet-style distributed command execution.",
    ],
    skills: ["Python", "Cybersecurity", "Network Security", "Reconnaissance", "Ethical Hacking"],
  },
  {
    organization: "Concentrix",
    title: "Advisor I, Customer Service",
    engagement: "Full-time",
    period: "Aug 2025-Sep 2025",
    location: "Bhubaneswar, Odisha, India",
    href: profile.experienceUrl,
    details: [
      "Worked with Concentrix Daksh Services India Private Limited from 26-Aug-2025 to 23-Sep-2025.",
      "Last held the post of Representative, Operations with the internal job title Advisor I, Customer Service.",
      "Strengthened professional communication, customer support, operations discipline, and service-focused problem solving.",
    ],
    skills: ["Communication", "Customer Support", "Operations", "Professional Communication"],
  },
  {
    organization: "RineX.Ai",
    title: "Student Intern",
    engagement: "Internship",
    period: "Mar 2024-Apr 2024",
    location: "Bhubaneswar, Odisha, India",
    href: profile.experienceUrl,
    details: [
      "Completed a Cyber Security with Ethical Hacking internship program focused on securing networks, systems, and data from cyber threats.",
      "Conducted ethical hacking activities to identify and mitigate potential security vulnerabilities.",
      "Worked in collaboration with Hipla to support cybersecurity measures, with the internship recognized by the Entrepreneurship Cell at IIT Bhubaneswar.",
    ],
    skills: ["Cybersecurity", "Ethical Hacking", "Network Security", "Vulnerability Assessment", "Collaboration"],
  },
];

export const certifications: Certification[] = [
  {
    name: "Technical Introduction to Cybersecurity 3.0",
    issuer: "Fortinet",
    issued: "Jul 2026",
    href: profile.certificationsUrl,
    skills: ["Authentication Control", "Network Access Control (NAC)", "Cybersecurity"],
    notes: "Includes certificate and NSE 2 badge.",
    issuerLogo: "https://cdn.simpleicons.org/fortinet/EE3124",
  },
  {
    name: "Fortinet Certified Fundamentals Cybersecurity",
    issuer: "Fortinet",
    issued: "Jul 2026",
    expires: "Jul 2028",
    href: profile.certificationsUrl,
    skills: ["Cybersecurity", "Secure SD-WAN", "Network Security", "Threat Awareness"],
    notes: "Includes FCF Cybersecurity badge.",
    issuerLogo: "https://cdn.simpleicons.org/fortinet/EE3124",
  },
  {
    name: "Introduction to the Threat Landscape 3.0 (NSE - 1)",
    issuer: "Fortinet",
    issued: "Mar 2026",
    href: profile.certificationsUrl,
    skills: ["Cybersecurity", "Cyber Threat Intelligence (CTI)"],
    notes: "Includes NSE 1 badge and certificate.",
    issuerLogo: "https://cdn.simpleicons.org/fortinet/EE3124",
  },
  {
    name: "Canva Essentials",
    issuer: "Canva",
    issued: "Feb 2026",
    credentialId: "2ebf90",
    href: profile.certificationsUrl,
    skills: ["Graphic Design", "Canva"],
    notes: "Includes Canva Essentials certificate PDF and badge.",
    issuerLogo: "https://static.canva.com/static/images/canva_logo_100x100@2x.png",
  },
  {
    name: "Graphic Design Essentials",
    issuer: "Canva",
    issued: "Jan 2026",
    credentialId: "570859",
    href: profile.certificationsUrl,
    skills: ["Graphic Design"],
    notes: "Includes badge image and certificate PDF.",
    issuerLogo: "https://static.canva.com/static/images/canva_logo_100x100@2x.png",
  },
  {
    name: "Basics of Python",
    issuer: "Infosys Springboard",
    issued: "Sep 2025",
    href: profile.certificationsUrl,
    skills: ["Python"],
    notes: "Certificate can be verified through verify.onwingspan.com.",
    issuerLogo: "https://cdn.simpleicons.org/infosys/007CC3",
  },
  {
    name: "Deloitte Australia - Cyber Job Simulation",
    issuer: "Forage",
    issued: "Aug 2025",
    credentialId: "CMnPeAaxD89Au8mKa",
    href: profile.certificationsUrl,
    skills: ["Cybersecurity"],
    notes: "Completion certificate available on LinkedIn.",
    issuerLogo: null,
  },
  {
    name: "C++ Course: Learn the Essentials",
    issuer: "Scaler",
    issued: "Jun 2025",
    href: profile.certificationsUrl,
    skills: ["C++"],
    notes: "Certificate of Excellence for completing the Scaler Topics tutorial.",
    issuerLogo: "https://www.scaler.com/storyblok-assets/f/290352327034910/190x40/762eb27df8/scaler-logo.svg",
  },
  {
    name: "TCS ION Career Edge - Young Professional",
    issuer: "TCS iON",
    issued: "2025",
    credentialId: "119854-27630826-1016",
    href: profile.certificationsUrl,
    skills: ["Presentation Skills", "Communication", "Soft Skills", "Resume Writing", "AI Overview"],
    notes: "Includes certificate of achievement and assessment report.",
    issuerLogo: "https://cdn.brandfetch.io/idbF6mGnXd/w/739/h/297/theme/light/logo.png?c=1bxid64Mup7aczewSAYMX&t=1693205878854",
  },
  {
    name: "Rinex Internship Certificate",
    issuer: "RineX.Ai",
    issued: "Apr 2024",
    credentialId: "CS24-RNI0-3086",
    href: profile.certificationsUrl,
    skills: ["Cybersecurity", "Ethical Hacking", "Internship Practice"],
    notes: "Completed Cyber Security with Ethical Hacking internship program at RINEX partnered with Hipla.",
    issuerLogo: null,
  },
  {
    name: "C for Beginners",
    issuer: "Great Learning",
    issued: "Jan 2025",
    href: profile.certificationsUrl,
    skills: ["C"],
    notes: "Certificate of Completion for the C for Beginners online course.",
    issuerLogo: "https://d1vwxdpzbgdqj.cloudfront.net/s3-public-images/learning-partners/greatlearning-brand.svg",
  },
  {
    name: "Cyber Security and Ethical Hacking Course Completion Certificate",
    issuer: "RineX.Ai",
    issued: "Mar 2024",
    credentialId: "CS23-RNC0-3086",
    href: profile.certificationsUrl,
    skills: ["Cybersecurity", "Ethical Hacking"],
    issuerLogo: null,
  },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
];

export const contactNotes = [
  "Open to cybersecurity internships, product-minded engineering work, and communication-led technical roles.",
  "Interested in collaborating with teams that value innovation, security, learning, and clear public communication.",
];
