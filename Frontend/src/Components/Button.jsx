import React from "react";
import { Loader2 } from "lucide-react";

function Button({
  text,
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
}) {
  const variants = {
    primary:
      "bg-[#AE7AFF] text-black hover:bg-[#9d69ff] shadow-lg shadow-violet-500/20 border border-transparent",

    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:border-zinc-700",

    outline:
      "bg-transparent border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800",

    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 border border-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-2xl px-4 py-2.5
        text-sm font-semibold tracking-tight
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-[#AE7AFF]/20
        ${variants[variant]}
        ${disabled || loading
          ? "cursor-not-allowed opacity-60"
          : "hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
        }
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
}

export default Button;