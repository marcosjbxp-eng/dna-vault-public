import { clsx } from "clsx";

type BadgeVariant = "default" | "success" | "danger" | "flare" | "ice";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-[--panel] text-[--smoke] border-[--border]",
  success: "bg-[--success]/10 text-[--success] border-[--success]/20",
  danger: "bg-[--danger]/10 text-[--danger] border-[--danger]/20",
  flare: "bg-[--flare]/10 text-[--flare] border-[--flare]/20",
  ice: "bg-[--ice]/10 text-[--ice] border-[--ice]/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-none border",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
