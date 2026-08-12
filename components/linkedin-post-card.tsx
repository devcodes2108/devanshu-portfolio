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

function ImageSlideshow({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const retreat = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isHovering || images.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(advance, 3200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isHovering, images.length, advance]);

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

  if (images.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded border border-black/8 bg-black/[0.02] text-[10px] font-medium uppercase tracking-[0.18em] text-black/45">
        No media
      </div>
    );
  }

  return (
    <div
      className="relative h-56 w-full overflow-hidden rounded border border-black/8 bg-black/[0.02]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-full w-full flex-shrink-0">
            <Image
              src={src}
              alt={`${alt} - image ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {isHovering && images.length > 1 && (
        <>
          <button
            type="button"
            onClick={retreat}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d3b33f]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={advance}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d3b33f]"
          >
            ›
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#d3b33f] ${
              i === index ? "w-4 bg-[#121212]" : "w-2 bg-black/25 hover:bg-black/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function LinkedInPostCard({ post }: { post: LinkedInPost }) {

  return (
    <article className="reveal-card rounded-lg border border-black/8 bg-white p-5 md:p-6">
      <div className="flex items-center gap-3">
        <CalendarBadge date={post.date} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/55">
            <span className="rounded-full border border-black/10 bg-[#f7f3eb] px-2 py-0.5">{post.category}</span>
            <span>{post.reactions ?? post.impressions ?? 0} reactions</span>
            <span>{post.comments ?? 0} comments</span>
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold tracking-[-0.05em] text-black">{post.title}</h3>
      <p className="mt-2 text-sm leading-7 text-black/65">{post.excerpt}</p>

      <div className="mt-4">
        <ImageSlideshow images={post.images} alt={post.imageAlt} />
      </div>

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
