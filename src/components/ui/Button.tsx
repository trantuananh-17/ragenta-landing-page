import { cn } from "@/lib/utils";

/**
 * The marketing site's button.
 *
 * Deliberately not the console's: a CTA on a landing page is bigger, rounder
 * and lifts on hover, where a button in a data table has to sit quietly in a
 * row. What the two share is the brand — `bg-primary` here and in the app
 * resolve to the same violet — and the focus treatment.
 *
 * Two exports because half the CTAs on this site are links, not buttons.
 * `buttonClasses` styles a `LocaleLink` or an `<a>`; `Button` is the real
 * element. Neither pulls in a component library — this site has none, and one
 * button is not a reason to start.
 *
 * `focus-visible` rather than `focus`: the `.btn-*` classes this replaces drew
 * their ring on mouse clicks too, which is noise for everyone who was not
 * navigating by keyboard. `motion-safe:` guards the lift for readers who have
 * asked for less movement.
 */
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:pointer-events-none disabled:opacity-60 motion-safe:hover:-translate-y-0.5";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-brand-700 hover:shadow-lg",
  secondary: "bg-subtle text-ink-muted hover:text-brand-600 hover:shadow-md",
  outline:
    "border border-line-strong bg-transparent text-ink hover:border-brand-500 hover:text-brand-600",
  ghost: "text-ink-muted hover:text-brand-600",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export function buttonClasses({
  variant = "primary",
  size = "lg",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
