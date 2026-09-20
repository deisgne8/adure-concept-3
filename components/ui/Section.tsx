import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { getSpacingClassName } from "../../lib/ui/spacing";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  fullViewport?: boolean;
  spacing?: Record<string, unknown>;
};

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    children,
    className,
    fullViewport = false,
    spacing,
    ...props
  },
  ref,
) {
  const spacingClassName = fullViewport ? "" : getSpacingClassName(spacing);
  const sectionClassName = [className, spacingClassName].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName} ref={ref} {...props}>
      {children}
    </section>
  );
});

export default Section;
