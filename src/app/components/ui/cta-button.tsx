import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  icon?: boolean;
  className?: string;
};

export function CtaButton({
  href,
  children,
  external = true,
  icon = true,
  className = "",
}: CtaButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`
        group
        inline-flex
        items-center
        justify-center
        gap-2.5
        rounded-full
        border
        border-white/15
        px-8
        py-3.5
        text-sm
        font-medium
        tracking-wide
        text-white
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:brightness-110
        active:scale-[0.98]
        ${className}
      `}
      style={{
        background: "linear-gradient(140deg, #668875 0%, #4a6b5c 100%)",
        boxShadow: "0 8px 28px rgba(38,61,53,0.22)",
      }}
    >
      {children}

      {icon && (
        <span
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-white/10
            transition-transform
            duration-300
            group-hover:translate-x-0.5
          "
        >
          <ChevronRight size={13} />
        </span>
      )}
    </a>
  );
}
