import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[--smoke]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full bg-[--surface] border border-[--border] rounded-none px-4 py-2.5 text-sm text-[--white]",
            "placeholder:text-[--smoke]",
            "focus:outline-none focus:border-[--flare] focus-visible:outline-none",
            "transition-colors duration-200",
            error && "border-[--danger] focus:border-[--danger]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[--danger]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
