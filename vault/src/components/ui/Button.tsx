"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-flare text-void font-bold hover:bg-flare-dim",
  secondary:
    "bg-panel text-mist border border-border hover:border-border/80 hover:bg-panel/80 hover:text-white",
  ghost:
    "bg-transparent text-smoke hover:text-white hover:bg-surface",
  danger:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-none",
  md: "px-5 py-2.5 text-sm rounded-none",
  lg: "px-7 py-3 text-base rounded-none",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 cursor-pointer",
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
      </motion.button>
    );
  }
);

Button.displayName = "Button";
