"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LinkedInIcon } from "@/components/portfolio-shell";
import type { LinkedInPost } from "@/data/linkedin-import";

function CalendarBadge({ date }: { date: string }) {
  const parsed = new Date(date);
  const month = parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = parsed.getDate();
  const year = parsed.getFullYear();

  return (
    <div className="flex flex-col items-center justify-center rounded border border-black/10 bg-black/5 px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-black/70 min-w-[3.2rem]">
      <span className="text-[#d3b33f]">{month}</span>
      <span className="text-lg leading-none text-black">{day}</span>
      <span className="text-black/45">{year}</span>
    </div>
  );
}

function FerrisWheelSlideshow({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const count = images.length;

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const retreat = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (isHovering || count <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(advance, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isHovering, count, advance]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) advance();
      else retreat();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (count === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded border border-black/8 bg-black/[0.02] text-[10px] font-medium uppercase tracking-[0.18em] text-black/45">
        NO MEDIA
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="relative h-56 w-full overflow-hidden rounded border border-black/8 bg-black/[0.02]">
        <div className="relative h-full w-full">
          <Image src={images[0]} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
        </div>
      </div>
    );
  }

  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - currentIndex;
    const normalizedOffset = offset === 0 ? 0 : offset > 0 ? (offset === 1 ? 1 : 2) : (offset === -1 ? -1 : -2);

    if (normalizedOffset === 0) {
      return {
        transform: "translateX(0) translateY(0) scale(1) rotate(0deg)",
        zIndex: 3,
        opacity: 1,
        filter: "brightness(1)",
        boxShadow: "0 20px 40px rgba(18,18,18,0.15)",
      };
    } else if (normalizedOffset === 1 || (currentIndex === count - 1 && index === 0)) {
      return {
        transform: "translateX(55%) translateY(12%) scale(0.82) rotate(3deg)",
        zIndex: 2,
        opacity: 0.75,
        filter: "brightness(0.92)",
        boxShadow: "0 12px 24px rgba(18,18,18,0.1)",
      };
    } else if (normalizedOffset === -1 || (currentIndex === 0 && index === count - 1)) {
      return {
        transform: "translateX(-55%) translateY(12%) scale(0.82) rotate(-3deg)",
        zIndex: 2,
        opacity: 0.75,
        filter: "brightness(0.92)",
        boxShadow: "0 12px 24px rgba(18,18,18,0.1)",
      };
    } else {
      return {
        transform: "translateX(0) translateY(0) scale(0.7) rotate(0deg)",
        zIndex: 1,
        opacity: 0,
        filter: "brightness(0.8)",
        boxShadow: "0 8px 16px rgba(18,18,18,0.08)",
      };
    }
  };

  return (
    <div
      className="relative h-64 w-full overflow-visible rounded border border-black/8 bg-black/[0.02]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full w-full">
        {images.map((src, i) => {
          const style = getCardStyle(i);
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
              style={{
                transform: style.transform,
                zIndex: style.zIndex,
                opacity: style.opacity,
                filter: style.filter,
                boxShadow: style.boxShadow,
                willChange: "transform, opacity",
                pointerEvents: i === currentIndex ? "auto" : "none",
              }}
            >
              <div className="relative h-40 w-72 overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={`${alt} - image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 33vw"
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>

      {count > 2 && isHovering && (
        <>
          <button
            type="button"
            onClick={retreat}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d3b33f]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={advance}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d3b33f]"
          >
            ›
          </button>
        </>
      )}

      {count > 2 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#d3b33f] ${
                i === currentIndex ? "w-4 bg-[#121212]" : "w-2 bg-black/25 hover:bg-black/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LinkedInPostCard({ post }: { post: LinkedInPost }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasImages = post.images && post.images.length > 0;
  const needsTruncation = post.text.length > 140;

  return (
    <article className="reveal-card rounded-lg border border-black/8 bg-white p-5 md:p-6">
      <div className="flex items-center gap-3">
        <CalendarBadge date={post.date} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black/55">
            <span className="rounded-full border border-black/10 bg-[#f7f3eb] px-2 py-0.5">{post.category}</span>
            {post.reactions != null && <span>{post.reactions} reactions</span>}
            {post.comments != null && <span>{post.comments} comments</span>}
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold tracking-[-0.05em] text-black">{post.title}</h3>

      <div className="mt-2 text-sm leading-7 text-black/65">
        <p className={isExpanded ? "" : "line-clamp-2"}>{post.text}</p>
        {needsTruncation && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 inline-block text-[10px] font-medium uppercase tracking-[0.18em] text-black/55 underline underline-offset-4 transition hover:text-black"
          >
            {isExpanded ? "Show less" : "More"}
          </button>
        )}
      </div>

      {hasImages && (
        <div className="mt-4">
          <FerrisWheelSlideshow images={post.images} alt={post.imageAlt} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {post.hashtags.slice(0, 5).map((tag) => (
          <span key={tag} className="rounded-full border border-black/10 bg-[#f7f3eb] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-black/60">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="social-button social-button-light inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black"
        >
          <LinkedInIcon className="h-3.5 w-3.5" />
          View on LinkedIn
        </a>
      </div>
    </article>
  );
}
