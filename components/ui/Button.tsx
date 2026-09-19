import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "default" | "primary" | "dark" | "link";

type SharedProps = {
  children: ReactNode;
  className?: string;
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
  const { children, className, variant = "default" } = props;
  const buttonClassName = [
    "btn",
    variant === "default" ? "" : variant,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const {
      children: _children,
      className: _className,
      href,
      variant: _variant,
      ...linkProps
    } = props;

    return (
      <a {...linkProps} className={buttonClassName} href={href}>
        {children}
      </a>
    );
  }

  const {
    children: _children,
    className: _className,
    type = "button",
    variant: _variant,
    ...nativeButtonProps
  } = props as NativeButtonProps;

  return (
    <button {...nativeButtonProps} className={buttonClassName} type={type}>
      {children}
    </button>
  );
}
