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

function FerrisWheelSlideshow({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
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
      diff > 0 ? advance() : retreat();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="relative h-48 w-full overflow-hidden rounded border border-black/8 bg-black/[0.02]">
        <Image src={images[0]} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
      </div>
    );
  }

  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - currentIndex;
    const n =
      offset === 0
        ? 0
        : offset > 0
          ? offset === 1
            ? 1
            : 2
          : offset === -1
            ? -1
            : -2;

    if (n === 0) {
      return {
        transform: "translateX(0) translateY(0) scale(1) rotate(0deg)",
        zIndex: 3,
        opacity: 1,
        filter: "brightness(1)",
        boxShadow: "0 14px 32px rgba(18,18,18,0.14)",
      };
    } else if (n === 1 || (currentIndex === count - 1 && index === 0)) {
      return {
        transform: "translateX(28%) translateY(-32%) scale(0.68) rotate(4deg)",
        zIndex: 2,
        opacity: 0.65,
        filter: "brightness(0.9)",
        boxShadow: "0 8px 18px rgba(18,18,18,0.08)",
      };
    } else if (n === -1 || (currentIndex === 0 && index === count - 1)) {
      return {
        transform: "translateX(-28%) translateY(32%) scale(0.68) rotate(-4deg)",
        zIndex: 2,
        opacity: 0.65,
        filter: "brightness(0.9)",
        boxShadow: "0 8px 18px rgba(18,18,18,0.08)",
      };
    } else {
      return {
        transform: "translateX(0) translateY(0) scale(0.5) rotate(0deg)",
        zIndex: 0,
        opacity: 0,
        filter: "brightness(0.8)",
        boxShadow: "0 4px 10px rgba(18,18,18,0.04)",
      };
    }
  };

  return (
    <div
      className="relative h-52 w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative mx-auto h-full w-full max-w-[200px]">
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
                pointerEvents: "none",
              }}
            >
              <div className="relative h-[120px] w-[88px] overflow-hidden rounded border border-black/10 bg-white">
                <Image
                  src={src}
                  alt={`${alt} - image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
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
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-2 py-1.5 text-[10px] font-semibold text-black shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d3b33f]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={advance}
            aria-label="Next image"
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-2 py-1.5 text-[10px] font-semibold text-black shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d3b33f]"
          >
            ›
          </button>
        </>
      )}

      {count > 2 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#d3b33f] ${
                i === currentIndex ? "w-4 bg-[#121212]" : "w-2 bg-black/25 hover:bg-black/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LinkedInPostCard({
  post,
  index,
  onHover,
}: {
  post: LinkedInPost;
  index: number;
  onHover?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasImages = post.images && post.images.length > 0;
  const needsTruncation = post.text.length > 140;

  return (
    <article
      className="group relative rounded-lg border border-black/8 bg-white p-5 md:p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_8px_24px_rgba(18,18,18,0.07)]"
      onMouseEnter={onHover}
    >
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
          <span
            key={tag}
            className="rounded-full border border-black/10 bg-[#f7f3eb] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-black/60"
          >
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
