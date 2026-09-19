import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export type ButtonVariant = "default" | "primary" | "dark" | "link";

type SharedProps = {
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
  variant?: ButtonVariant;
};

type LinkButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, "children" | "className"> & {
    href: string;
  };

type NativeButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    href?: never;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

export default function Button(props: ButtonProps) {
  const {
    children,
    className,
    showArrow: showArrowProp,
    variant = "default",
  } = props;
  const showArrow = showArrowProp ?? variant === "link";
  const buttonClassName = [
    "btn",
    variant === "default" ? "" : variant,
    variant === "link" ? "button-link" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const {
      children: _children,
      className: _className,
      href,
      showArrow: _showArrow,
      variant: _variant,
      ...linkProps
    } = props;

    return (
      <a {...linkProps} className={buttonClassName} href={href}>
        {children}
        {showArrow ? <ArrowRight aria-hidden="true" className="button-arrow" /> : null}
      </a>
    );
  }

  const {
    children: _children,
    className: _className,
    showArrow: _showArrow,
    type = "button",
    variant: _variant,
    ...nativeButtonProps
  } = props as NativeButtonProps;

  return (
    <button {...nativeButtonProps} className={buttonClassName} type={type}>
      {children}
      {showArrow ? <ArrowRight aria-hidden="true" className="button-arrow" /> : null}
    </button>
  );
}
