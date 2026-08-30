import { cn } from "@/lib/utils";

/**
 * The title bar of the fake app windows the sections are built around. It
 * appears in a dozen places, so the traffic lights and the border live here
 * rather than being retyped per section.
 */
export function WindowChrome({
  title,
  size = "md",
  className,
  children,
}: {
  title?: string;
  size?: "sm" | "md";
  className?: string;
  children?: React.ReactNode;
}) {
  const dot = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-line bg-chrome",
        size === "sm" ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
    >
      <span className={cn(dot, "rounded-full bg-[#ff5f57]")} />
      <span className={cn(dot, "rounded-full bg-[#febc2e]")} />
      <span className={cn(dot, "rounded-full bg-[#28c840]")} />
      {title && (
        <span
          className={cn(
            "ml-2 truncate font-mono text-ink-faint",
            size === "sm" ? "text-[10px]" : "ml-3 text-xs",
          )}
        >
          {title}
        </span>
      )}
      {children}
    </div>
  );
}

/** The app-window shell: chrome + body, on the section's window surface. */
export function AppWindow({
  title,
  size = "md",
  className,
  children,
}: {
  title?: string;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl bg-window shadow-[var(--shadow-window)] ring-1 ring-[var(--ring-window)]",
        className,
      )}
    >
      <WindowChrome title={title} size={size} />
      {children}
    </div>
  );
}
