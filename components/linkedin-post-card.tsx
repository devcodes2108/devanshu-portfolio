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
      diff > 0 ? retreat() : advance();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="relative h-64 w-full overflow-hidden rounded border border-black/8 bg-black/[0.02]">
        <Image src={images[0]} alt={alt} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
      </div>
    );
  }

  const getState = (index: number) => {
    const diff = index - currentIndex;
    const normalized = diff === 0 ? 0 : diff > 0 ? (diff === 1 ? 1 : 2) : (diff === -1 ? -1 : -2);

    if (normalized === 0) {
      return { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, z: 2 };
    } else if (normalized === 1 || (currentIndex === count - 1 && index === 0)) {
      return { opacity: 0.35, x: 42, y: 0, rotate: 10, scale: 0.82, z: 1 };
    } else if (normalized === -1 || (currentIndex === 0 && index === count - 1)) {
      return { opacity: 0.25, x: -42, y: 8, rotate: -10, scale: 0.78, z: 0 };
    } else {
      return { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.75, z: 0 };
    }
  };

  return (
    <div
      className="relative h-64 w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full w-full">
        {images.map((src, i) => {
          const state = getState(i);
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
              style={{
                opacity: state.opacity,
                transform: `translateX(${state.x}%) translateY(${state.y}%) rotate(${state.rotate}deg) scale(${state.scale})`,
                zIndex: state.z,
                willChange: "transform, opacity",
              }}
            >
              <div className="relative h-48 w-48 overflow-hidden rounded border border-black/10 bg-white md:h-56 md:w-56">
                <Image
                  src={src}
                  alt={`${alt} - image ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 60vw, 320px"
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
      className="group relative rounded-lg border border-black/8 bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_8px_24px_rgba(18,18,18,0.07)] md:p-5"
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

      <h3 className="mt-3 text-base font-bold tracking-[-0.05em] text-black md:text-lg">{post.title}</h3>

      <div className="mt-1.5 text-sm leading-7 text-black/65">
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
        <div className="mt-3">
          <FerrisWheelSlideshow images={post.images} alt={post.imageAlt} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.hashtags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-black/10 bg-[#f7f3eb] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-black/60"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="social-button social-button-light inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black"
        >
          <LinkedInIcon className="h-3.5 w-3.5" />
          View on LinkedIn
        </a>
      </div>
    </article>
  );
}
