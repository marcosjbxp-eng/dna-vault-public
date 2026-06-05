"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[--flare] text-[--void] font-black hover:bg-[--white] active:bg-[--flare-dim]",
  secondary:
    "bg-transparent text-[--mist] border border-[--border] hover:border-[--flare] hover:text-[--white]",
  ghost:
    "bg-transparent text-[--smoke] hover:text-[--white] hover:bg-[--surface]",
  danger:
    "bg-[--danger]/10 text-[--danger] border border-[--danger]/30 hover:bg-[--danger]/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-[11px]",
  md: "px-5 py-2.5 text-xs",
  lg: "px-7 py-3.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-bold tracking-wider uppercase",
          "transition-[background-color,color,border-color,transform] duration-200 ease-out",
          "active:scale-[0.98] cursor-pointer rounded-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
