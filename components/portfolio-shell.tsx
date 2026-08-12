"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { LinkedInPostCard } from "@/components/linkedin-post-card";
import { normalizeLinkedInPosts } from "@/lib/linkedin";
import {
  certifications,
  contactNotes,
  experienceHighlights,
  focusAreas,
  navigation,
  profile,
  skillGroups,
  socialLinks,
} from "@/data/portfolio";
import type { GitHubRepoSummary } from "@/lib/github";
import type { LinkedInPost } from "@/data/linkedin-import";

function InteractiveDotField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 900 }, (_, index) => {
        const column = index % 30;
        const row = Math.floor(index / 30);
        const offset = row % 2 === 0 ? 0 : 1.8;

        return {
          id: index,
          left: `${1.5 + column * 3.2 + offset}%`,
          top: `${2.5 + row * 4.8}%`,
          opacity: 0.18 + (index % 5) * 0.04,
          duration: 6 + (index % 7) * 1.4,
          delay: (index * 0.37) % 9,
        };
      }),
    [],
  );

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dotElements = Array.from(field.querySelectorAll<HTMLElement>(".ambient-dot"));
    let animationFrame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    const updateDots = () => {
      dotElements.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = pointerX - centerX;
        const deltaY = pointerY - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const radius = 110;

        if (distance < radius && distance > 0) {
          const force = (1 - distance / radius) ** 2 * 22;
          dot.style.transform = `translate3d(${(deltaX / distance) * force}px, ${(deltaY / distance) * force}px, 0) scale(1.25)`;
          dot.style.opacity = "0.55";
        } else {
          dot.style.transform = "";
          dot.style.opacity = dot.dataset.opacity ?? "0.22";
        }
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(() => {
          updateDots();
          animationFrame = 0;
        });
      }
    };

    const onPointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
      updateDots();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={fieldRef} className="ambient-dot-field" aria-hidden="true">
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="ambient-dot"
          data-opacity={dot.opacity.toFixed(3)}
          style={{ left: dot.left, top: dot.top, opacity: dot.opacity, animation: `dot-drift ${dot.duration}s ease-in-out ${dot.delay}s infinite alternate` }}
        />
      ))}
    </div>
  );
}

export function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.34V8.98h3.42v1.57h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.53V8.98H7.1v11.47ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

export function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2.13c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.02c.98 0 1.96.13 2.88.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.16v3.12c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function IssuerLogo({ src, alt, className = "" }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    const initials = alt
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <span className={`inline-flex items-center justify-center rounded border border-black/10 bg-black/5 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-black/60 ${className}`}>
        {initials}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${alt} logo`}
      width={32}
      height={32}
      className={`h-8 w-8 object-contain ${className}`}
      unoptimized
    />
  );
}

function FlippingLetter({ letter, index }: { letter: string; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (letter === " ") return <span key={index} className="name-space" />;

  return (
    <span
      key={index}
      className={`name-letter ${isFlipped ? "is-flipped" : ""}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onFocus={() => setIsFlipped(true)}
      onBlur={() => setIsFlipped(false)}
    >
      {letter}
    </span>
  );
}

function FlippableName({ name, className }: { name: string; className?: string }) {
  return (
    <span className={className}>
      {name.split("").map((letter, index) => (
        <FlippingLetter key={index} letter={letter} index={index} />
      ))}
    </span>
  );
}

function SocialIcon({ label, className = "" }: { label: string; className?: string }) {
  if (label.toLowerCase().includes("github")) return <GitHubIcon className={className} />;
  if (label.toLowerCase().includes("linkedin")) return <LinkedInIcon className={className} />;
  return null;
}

function ScrollRevealParagraph({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={ref} className={`reveal-paragraph ${isVisible ? "is-visible" : ""} ${className}`}>
      {children}
    </p>
  );
}

function getProjectDescription(repo: GitHubRepoSummary) {
  const description = repo.description?.trim();
  if (description) return description;
  if (repo.topics.length > 0) return `Public GitHub project focused on ${repo.topics.slice(0, 3).join(", ")}.`;
  if (repo.language) return `Public ${repo.language} repository. Add a GitHub repo description to show a custom summary here.`;
  return "Public GitHub repository. Add a GitHub repo description to show a custom summary here.";
}

function TimelinePostsSection({ posts }: { posts: LinkedInPost[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [lineProgress, setLineProgress] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(1000);
  const [activeCardIndex, setActiveCardIndex] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateLine = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      if (sectionTop >= viewportHeight) {
        setLineProgress(0);
        setActiveCardIndex(-1);
      } else if (sectionTop + sectionHeight <= 0) {
        setLineProgress(1);
        setActiveCardIndex(posts.length - 1);
      } else {
        const scrolled = viewportHeight - sectionTop;
        const total = sectionHeight + viewportHeight;
        const rawProgress = Math.min(1, Math.max(0, scrolled / total));
        const delay = 0.0;
        const adjustedProgress = Math.min(1, Math.max(0, (rawProgress - delay) / (1 - delay)));
        setLineProgress(adjustedProgress);
        const newActiveIndex = Math.min(
          posts.length - 1,
          Math.floor(adjustedProgress * posts.length)
        );
        setActiveCardIndex(newActiveIndex);
      }
    };

    updateLine();
    window.addEventListener("scroll", updateLine, { passive: true });
    return () => window.removeEventListener("scroll", updateLine);
  }, [posts.length]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [posts.length]);

  const totalCards = posts.length;
  const nodeSpacing = 260;
  const viewBoxHeight = totalCards > 0 ? 100 + (totalCards - 1) * nodeSpacing + 100 : 400;

  const generateStraightPath = () => {
    if (totalCards === 0) return "";
    const centerX = 600;
    const leftCardX = 294;
    const rightCardX = 906;
    const parts = [`M ${centerX} 0`];

    for (let i = 0; i < totalCards; i++) {
      const nodeY = 100 + i * nodeSpacing;
      const isLeft = i % 2 === 0;
      const targetX = isLeft ? leftCardX : rightCardX;

      parts.push(`L ${centerX} ${nodeY}`);
      parts.push(`L ${targetX} ${nodeY}`);
      parts.push(`L ${centerX} ${nodeY}`);
    }

    return parts.join(" ");
  };

  const straightPath = generateStraightPath();
  const maskHeight = viewBoxHeight * lineProgress;

  return (
    <section ref={sectionRef} className="relative py-12 md:py-20">
      <div className="relative">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 0 }}
          viewBox={`0 0 1200 ${viewBoxHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="timeline-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d3b33f" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#d3b33f" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d3b33f" stopOpacity="0.2" />
            </linearGradient>
            <mask id="timeline-progress-mask">
              <rect x="0" y="0" width="1200" height={maskHeight} fill="white" />
            </mask>
            <filter id="timeline-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d={straightPath} stroke="url(#timeline-gold)" strokeWidth="3" fill="none" />

          <path
            d={straightPath}
            stroke="#d3b33f"
            strokeWidth="4"
            fill="none"
            opacity="0.9"
            mask="url(#timeline-progress-mask)"
            filter={activeCardIndex >= 0 ? "url(#timeline-glow)" : "none"}
          />
        </svg>

        <div className="relative space-y-4 md:space-y-6" style={{ zIndex: 1 }}>
          {posts.map((post, index) => {
            const isLeft = index % 2 === 0;
            const isActive = index === activeCardIndex;
            return (
              <div
                key={post.id}
                className={`relative pl-10 md:pl-12 ${isLeft ? "md:pr-[55%]" : "md:pl-[55%]"}`}
              >
                <div
                  className="absolute left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#d3b33f] bg-white"
                  aria-hidden="true"
                />
                <div className={`timeline-card-wrapper ${isActive ? "is-line-active" : ""}`}>
                  <LinkedInPostCard post={post} index={index} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PortfolioShell({ githubRepos }: { githubRepos: GitHubRepoSummary[] }) {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
  const [experienceLineProgress, setExperienceLineProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { posts: linkedInPosts } = normalizeLinkedInPosts();

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const updateHeroState = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const heroHeight = hero.offsetHeight;
      const maxScroll = viewportHeight * 0.45;

      if (scrollY >= maxScroll) {
        hero.classList.add("is-hero-hidden");
        hero.querySelector(".hero-photo-stack")?.classList.add("is-papers-merged");
      } else if (scrollY <= 0) {
        hero.classList.remove("is-hero-hidden");
        hero.querySelector(".hero-photo-stack")?.classList.remove("is-papers-merged");
      } else {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        hero.style.opacity = (1 - progress * 0.35).toFixed(3);
        hero.style.transform = `translate3d(0, ${-progress * 30}px, 0) scale(${1 - progress * 0.02})`;

        const photoStack = hero.querySelector(".hero-photo-stack");
        if (photoStack) {
          const backLayer = photoStack.querySelector(".hero-paper-layer--back");
          const midLayer = photoStack.querySelector(".hero-paper-layer--mid");
          const frontLayer = photoStack.querySelector(".hero-paper-layer--front");

          if (backLayer && midLayer && frontLayer) {
            const backOpacity = Math.max(0, 0.55 - progress * 0.55);
            const midOpacity = Math.max(0, 0.75 - progress * 0.75);
            const frontOpacity = Math.min(1, 0.9 + progress * 0.1);

            (backLayer as HTMLElement).style.opacity = backOpacity.toFixed(3);
            (backLayer as HTMLElement).style.transform = `translate3d(${18 - progress * 18}px, ${22 - progress * 22}px, 0) rotate(${4 - progress * 4}deg)`;
            (midLayer as HTMLElement).style.opacity = midOpacity.toFixed(3);
            (midLayer as HTMLElement).style.transform = `translate3d(${9 - progress * 9}px, ${11 - progress * 11}px, 0) rotate(${2 - progress * 2}deg)`;
            (frontLayer as HTMLElement).style.opacity = frontOpacity.toFixed(3);
            (frontLayer as HTMLElement).style.transform = `translate3d(${-3 + progress * 3}px, ${-4 + progress * 4}px, 0) rotate(${-1 + progress * 1}deg)`;
          }
        }
      }
    };

    updateHeroState();
    window.addEventListener("scroll", updateHeroState, { passive: true });
    return () => window.removeEventListener("scroll", updateHeroState);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateScrollState = () => {
      const section = document.getElementById("experience");
      const currentProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight * 1.3, 1)));
      setScrollProgress(currentProgress);

      if (!section) return;

      const items = Array.from(section.querySelectorAll(".experience-item"));
      if (!items.length) return;

      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight * 0.48);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveExperienceIndex(bestIndex);

      const targetY = window.innerHeight * 0.48;
      const totalItems = items.length;

      let passedCount = 0;
      let partialProgress = 0;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;

        if (itemCenter <= targetY) {
          passedCount++;
          if (index < totalItems - 1) {
            const nextItem = items[index + 1].getBoundingClientRect();
            const nextCenter = nextItem.top + nextItem.height / 2;
            const gap = nextCenter - itemCenter;
            if (gap > 0) {
              partialProgress = Math.min(1, Math.max(0, (targetY - itemCenter) / gap)) / totalItems;
            }
          }
        }
      });

      const baseProgress = passedCount / totalItems;
      setExperienceLineProgress(Math.min(1, baseProgress + partialProgress));
    };

    if (prefersReducedMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const animatedElements = document.querySelectorAll<HTMLElement>(".reveal-section, .reveal-copy, .reveal-card");
    animatedElements.forEach((element) => {
      element.dataset.reveal = "visible";
    });
  }, []);

  return (
    <div className="site-shell relative min-h-screen overflow-hidden bg-[#f7f7f3] text-[#121212]">
      <InteractiveDotField />

      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f7f3]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#home" className="name-matrix text-sm font-semibold uppercase tracking-[0.32em] text-black">
            <FlippableName name={profile.name} />
          </a>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => {
              const isActive = activeSection === item.href.replace("#", "") || (item.href === "#about" && activeSection === "home");

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium uppercase tracking-[0.22em] transition-colors ${isActive ? "text-[#121212]" : "text-black/55 hover:text-black"}`}
                  onClick={() => setActiveSection(item.href.replace("#", ""))}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black md:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              Menu
            </button>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="social-button social-button-dark inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
              Connect
            </a>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-black/5 bg-[#f7f7f3] px-6 py-4 md:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/65"
                  onClick={() => {
                    setActiveSection(item.href.replace("#", ""));
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main id="home" className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-10 lg:px-10">
        <section ref={heroRef} className="hero-opening reveal-section grid items-center gap-10 pb-20 pt-8 md:min-h-[80vh] md:grid-cols-[1.1fr_0.9fr] md:pt-16">
          <div className="space-y-8 reveal-copy">
            <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-black/60">
              <span className="inline-block h-px w-10 bg-[#d3b33f]" />
              Portfolio / Product / Design
            </div>

            <div className="space-y-5">
              <h1 className="name-matrix max-w-xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.08em] text-black md:text-7xl lg:text-[7rem]">
                <span className="name-line block">
                  <FlippableName name="Devanshu" />
                </span>
                <span className="name-line block text-[#d3b33f]">
                  <FlippableName name="Singh" />
                </span>
              </h1>

              <p className="hero-text max-w-xl text-lg leading-8 text-black/70 md:text-xl">{profile.headline}</p>

              <p className="hero-text max-w-lg text-base leading-7 text-black/65">{profile.introduction}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#projects"
                className="social-button social-button-gold inline-flex items-center justify-center rounded-full bg-[#d3b33f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#121212] shadow-[0_18px_45px_rgba(211,179,63,0.26)]"
              >
                Explore my work
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="social-button social-button-light inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black"
              >
                <LinkedInIcon className="h-4 w-4" />
                Connect with me
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/55">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="social-text-link inline-flex items-center gap-1.5 transition">
                  <SocialIcon label={link.label} className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hero-photo-stack relative flex items-center justify-center reveal-copy">
            <div className="hero-paper-layer hero-paper-layer--back" aria-hidden="true" />
            <div className="hero-paper-layer hero-paper-layer--mid" aria-hidden="true" />
            <div className="hero-paper-layer hero-paper-layer--front" aria-hidden="true" />
            <div className="hero-photo-frame">
              <Image src={profile.photo ?? "/publicprofile.jpg"} alt={profile.name} width={900} height={1200} priority className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section id="about" className="reveal-section grid gap-10 border-t border-black/5 py-20 md:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal-copy">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">About</p>
            <h2 className="title-shimmer mt-4 max-w-xs text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">Built for clarity, craft and momentum.</h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-black/70 reveal-copy">
            {profile.aboutParagraphs.map((paragraph) => (
              <ScrollRevealParagraph key={paragraph}>{paragraph}</ScrollRevealParagraph>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              {focusAreas.map((item) => (
                <span key={item} className="reveal-card rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black/70">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="reveal-section border-t border-black/5 py-20">
          <div className="mb-12 max-w-xl reveal-copy">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">Experience</p>
            <h2 className="title-shimmer mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">An evolving technical story.</h2>
          </div>

          <div className="experience-list" style={{ ["--experience-progress" as string]: experienceLineProgress.toFixed(3) }}>
            <svg className="experience-flow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path className="experience-flow-base" d="M20 0 C40 10 60 10 80 20 C60 30 40 30 20 40 C40 50 60 50 80 60 C60 70 40 70 20 80 C40 90 60 90 80 100" pathLength="1" />
              <path className="experience-flow-progress" d="M20 0 C40 10 60 10 80 20 C60 30 40 30 20 40 C40 50 60 50 80 60 C60 70 40 70 20 80 C40 90 60 90 80 100" pathLength="1" />
              <circle className="experience-flow-node" cx="20" cy="0" r="1.2" />
              <circle className="experience-flow-node" cx="80" cy="20" r="1.2" />
              <circle className="experience-flow-node" cx="20" cy="40" r="1.2" />
              <circle className="experience-flow-node" cx="80" cy="60" r="1.2" />
              <circle className="experience-flow-node" cx="20" cy="80" r="1.2" />
              <circle className="experience-flow-node" cx="80" cy="100" r="1.2" />
            </svg>

            {experienceHighlights.map((item, index) => (
              <div
                key={`${item.organization}-${item.title}`}
                 className={`experience-item reveal-card ${index % 2 === 0 ? "is-left" : "is-right"} grid gap-4 rounded border p-5 md:grid-cols-[132px_1fr] md:items-start ${
                  activeExperienceIndex === index ? "is-active border-[#d3b33f]/35 bg-[#f9f4df]" : "border-black/8 bg-white"
                }`}
              >
                <div className="space-y-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/50">
                  <p>{item.period}</p>
                  <p>{item.engagement}</p>
                  <p>{item.location}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <a href={item.href} target="_blank" rel="noreferrer" className="group/title inline-flex items-center gap-2">
                      <LinkedInIcon className="h-4 w-4 text-[#0a66c2]" />
                      <h3 className="text-xl font-bold tracking-[-0.05em] text-black group-hover/title:underline group-hover/title:decoration-[#d3b33f] group-hover/title:underline-offset-4">
                        {item.organization}
                      </h3>
                    </a>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-black/55">{item.title}</p>
                  </div>

                  {item.roles ? (
                    <div className="space-y-2 border-y border-black/5 py-3">
                      {item.roles.map((role) => (
                        <div key={`${item.organization}-${role.title}-${role.period}`} className="grid gap-1 text-sm sm:grid-cols-[1fr_auto]">
                          <span className="font-semibold text-black">{role.title}</span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/50">
                            {role.period}{role.mode ? ` / ${role.mode}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <ul className="space-y-2 text-sm leading-6 text-black/65">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[#d3b33f]" />
                        <ScrollRevealParagraph>{detail}</ScrollRevealParagraph>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span key={`${item.organization}-${skill}`} className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-black/55">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="posts" className="reveal-section border-t border-black/5">
          <div className="mb-10 max-w-xl reveal-copy">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">From my LinkedIn</p>
            <h2 className="title-shimmer mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">Ideas, builds and thoughts.</h2>
          </div>
          <TimelinePostsSection posts={linkedInPosts} />
        </section>
        <section id="skills" className="reveal-section border-t border-black/5 py-20">
          <div className="mb-10 max-w-xl reveal-copy">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">Capabilities</p>
            <h2 className="title-shimmer mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">Thoughtful craft across product and code.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {skillGroups.map((group, index) => (
              <div key={group.title} className={`reveal-card rounded-lg border border-black/8 bg-white p-6 ${index % 2 === 1 ? "md:translate-y-6" : ""}`}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/60">{group.title}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-black/75">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#d3b33f]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="credentials" className="reveal-section border-t border-black/5 py-20">
          <div className="mb-10 max-w-xl reveal-copy">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">Certifications</p>
            <h2 className="title-shimmer mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">Security learning with practical momentum.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {certifications.map((item, index) => (
              <div key={item.name} className={`reveal-card rounded-lg border border-black/8 bg-white p-6 ${index % 2 === 1 ? "md:translate-y-5" : ""}`}>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/55">
                  Issued {item.issued}{item.expires ? ` / Expires ${item.expires}` : ""}
                </div>
                <a href={item.href} target="_blank" rel="noreferrer" className="group/title mt-3 inline-flex items-center gap-2">
                  <LinkedInIcon className="h-4 w-4 text-[#0a66c2]" />
                  <h3 className="text-2xl font-bold tracking-[-0.05em] text-black group-hover/title:underline group-hover/title:decoration-[#d3b33f] group-hover/title:underline-offset-4">{item.name}</h3>
                </a>
                <div className="mt-2 flex items-center gap-2">
                  <IssuerLogo src={item.issuerLogo} alt={item.issuer} />
                  <p className="text-sm uppercase tracking-[0.18em] text-black/55">{item.issuer}</p>
                </div>
                {item.credentialId ? <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-black/45">Credential ID {item.credentialId}</p> : null}
                {item.notes ? <p className="mt-4 text-sm leading-6 text-black/62">{item.notes}</p> : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span key={`${item.name}-${skill}`} className="rounded-full border border-black/10 bg-[#f7f3eb] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-black/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="reveal-section border-t border-black/5 py-20">
          <div className="mb-10 flex items-end justify-between gap-6 reveal-copy">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">Selected work</p>
              <h2 className="title-shimmer mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">Public projects and explorations.</h2>
            </div>
            <a href={profile.github} target="_blank" rel="noreferrer" className="social-text-link hidden items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] md:inline-flex">
              <GitHubIcon className="h-3.5 w-3.5" />
              View GitHub {"->"}
            </a>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {githubRepos.length > 0 ? (
              githubRepos.map((repo, index) => (
                <article
                  key={repo.name}
                  className={`reveal-card project-card group rounded-lg border border-black/8 bg-white p-6 transition-transform duration-500 ${
                    index % 2 === 1 ? "lg:translate-y-8" : "lg:translate-y-2"
                  }`}
                >
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/55">{repo.language ?? "Project"}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/45">{new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-[-0.05em] text-black">{repo.name}</h3>
                  <ScrollRevealParagraph className="mt-4 min-h-[5.5rem] text-sm leading-7 text-black/65">{getProjectDescription(repo)}</ScrollRevealParagraph>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="rounded-full border border-black/10 bg-[#f5f2ea] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-black/60">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-black/55">
                    <span>{repo.stargazers_count} stars</span>
                    <span>{repo.forks_count} forks</span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="social-button social-button-dark inline-flex items-center justify-center gap-2 rounded-full bg-black px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      <GitHubIcon className="h-3.5 w-3.5" />
                      Repo
                    </a>
                    {repo.homepage ? (
                      <a href={repo.homepage} target="_blank" rel="noreferrer" className="social-button social-button-light inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
                        Live
                      </a>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="reveal-card rounded-lg border border-dashed border-black/15 bg-white/70 p-8 text-sm text-black/60 lg:col-span-3">
                GitHub repositories are temporarily unavailable. The public profile remains accessible at{" "}
                <a href={profile.github} className="inline-flex items-center gap-1 font-semibold text-black underline underline-offset-4">
                  <GitHubIcon className="h-4 w-4" />
                  GitHub
                </a>.
              </div>
            )}
          </div>
        </section>

        <section id="github" className="reveal-section border-t border-black/5 py-20">
          <div className="border border-black/8 bg-[#141414] p-8 text-white md:p-10 reveal-copy">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d3b33f]">GitHub</p>
                <h2 className="title-shimmer shimmer-light mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-white md:text-5xl">Open source and product thinking.</h2>
              </div>
              <a href={profile.github} target="_blank" rel="noreferrer" className="social-button social-button-dark-panel inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                <GitHubIcon className="h-4 w-4" />
                Visit GitHub
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-5 reveal-card">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/55">Public profile</p>
                <p className="mt-4 text-3xl font-black tracking-[-0.06em] text-white">@devcodes2108</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-5 reveal-card">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/55">Latest repos</p>
                <p className="mt-4 text-3xl font-black tracking-[-0.06em] text-white">{githubRepos.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-5 reveal-card">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/55">Activity</p>
                <p className="mt-4 text-3xl font-black tracking-[-0.06em] text-white">Public</p>
              </div>
            </div>

            <a href={profile.github} target="_blank" rel="noreferrer" className="github-calendar reveal-card mt-6 block rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/55">Contribution calendar</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">Live GitHub commit activity</h3>
                </div>
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d3b33f]">
                  <GitHubIcon className="h-4 w-4" />
                  Auto-updating
                </span>
              </div>
              <div className="github-calendar-viewport">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://ghchart.rshah.org/d3b33f/devcodes2108" alt="Devanshu Singh GitHub contribution calendar" loading="lazy" />
              </div>
            </a>
          </div>
        </section>

        <section id="contact" className="reveal-section border-t border-black/5 py-20">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div className="reveal-copy">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/55">Contact</p>
              <h2 className="title-shimmer mt-4 text-3xl font-black uppercase tracking-[-0.06em] text-black md:text-5xl">Let&apos;s build something precise and memorable.</h2>
            </div>

            <div className="space-y-5 reveal-copy">
              <p className="text-lg leading-8 text-black/70 reveal-copy">I&apos;m available for product-minded frontend work, thoughtful engineering, and design-led digital experiences.</p>

              <ul className="space-y-3 text-sm leading-7 text-black/70">
                {contactNotes.map((note) => (
                  <li key={note} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#d3b33f]" />
                    <ScrollRevealParagraph className="flex-1">{note}</ScrollRevealParagraph>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-button social-button-light inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black"
                  >
                    <SocialIcon label={link.label} className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-black/5 bg-[#f1efe9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-[10px] font-medium uppercase tracking-[0.22em] text-black/55 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>(c) {new Date().getFullYear()} Devanshu Singh</p>
          <div className="flex gap-5">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-black">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
