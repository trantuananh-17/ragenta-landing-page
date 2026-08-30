import { cn } from "@/lib/utils";

const widths = {
  default: "max-w-7xl", // standard site boundary
  narrow: "max-w-3xl", // centered text columns (CTA, FAQ, hero copy)
  medium: "max-w-5xl",
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
