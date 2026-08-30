/**
 * Inline SVG brand marks. Rendered as DOM rather than through next/image so
 * they inherit the current theme's colours and paint with the rest of the page.
 *
 * The mark is a retrieval graph: one question node linked to three source
 * nodes. `currentColor` drives the wordmark so it follows the surrounding text.
 */

type MarkProps = {
  className?: string;
  /** Accent used for the mark. Defaults to the brand token. */
  accent?: string;
};

export function RagentaMark({
  className,
  accent = "var(--brand-500)",
}: MarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="9" fill={accent} />
      <g stroke="var(--brand-on)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M11 16 L21 9.5" />
        <path d="M11 16 L21 16" />
        <path d="M11 16 L21 22.5" />
      </g>
      <g fill="var(--brand-on)">
        <circle cx="10.5" cy="16" r="3.1" />
        <circle cx="21.5" cy="9.5" r="2.1" />
        <circle cx="21.5" cy="16" r="2.1" />
        <circle cx="21.5" cy="22.5" r="2.1" />
      </g>
    </svg>
  );
}

/** Mark + wordmark. Set the height via className; width follows. */
export function RagentaWordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <RagentaMark className="h-7 w-7" />
      <span className="font-heading text-[19px] font-semibold tracking-tight text-ink">
        Ragenta
      </span>
    </span>
  );
}
