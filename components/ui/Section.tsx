import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { getSpacingClassName } from "../../lib/ui/spacing";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  fullViewport?: boolean;
  spacing?: Record<string, unknown>;
};

export default function Section({
  children,
  className,
  fullViewport = false,
  spacing,
  ...props
}: SectionProps) {
  const spacingClassName = fullViewport ? "" : getSpacingClassName(spacing);
  const sectionClassName = [className, spacingClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName} {...props}>
      {children}
    </section>
  );
}
