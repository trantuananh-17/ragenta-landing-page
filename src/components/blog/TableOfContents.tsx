"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/markdown";

/**
 * Sticky "on this page" rail for a post.
 *
 * Anchors are plain links: LenisProvider is configured with `anchors`, so it
 * already intercepts them and scrolls smoothly, and `.prose-document`'s
 * scroll-margin keeps the heading clear of the fixed navbar. Handling the click
 * here would fight both.
 */
export function TableOfContents({
  headings,
  label,
  className,
}: {
  headings: TocHeading[];
  label: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    // A band across the upper third of the viewport: a heading becomes current
    // when it reaches reading position, rather than the moment it appears at
    // the bottom of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky top-28 hidden w-56 shrink-0 self-start lg:block",
        className,
      )}
    >
      <p className="mb-3 font-mono text-xs tracking-wide text-ink-faint uppercase">
        {label}
      </p>
      <ul className="space-y-1 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pr-2 text-sm leading-5 transition-colors",
                heading.level === 3 ? "pl-6" : "pl-4",
                activeId === heading.id
                  ? "border-brand-600 font-medium text-ink"
                  : "border-transparent text-ink-subtle hover:text-ink",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
