import { cn } from "@/lib/utils";

const widths = {
  default: "max-w-7xl", // standard site boundary
  narrow: "max-w-3xl", // centered text columns (CTA, FAQ, hero copy)
  medium: "max-w-5xl",
  // Five pricing plans side by side. At the default 1280px boundary each card
  // is ~230px, which is narrower than the price it has to hold; this buys them
  // ~270px and is used for nothing else.
  wide: "max-w-[90rem]",
} as const;

type ContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  width?: keyof typeof widths;
};

export function Container({
  width = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 md:px-8", widths[width], className)}
      {...props}
    />
  );
}
