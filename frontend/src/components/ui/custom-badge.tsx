
import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "purchase" | "donation" | "transfer";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = "default", children, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "warning" && "bg-yellow-100 text-yellow-800",
        variant === "error" && "bg-red-100 text-red-800",
        variant === "default" && "bg-gray-100 text-gray-800",
        variant === "purchase" && "bg-blue-100 text-blue-800",
        variant === "donation" && "bg-green-100 text-green-800",
        variant === "transfer" && "bg-amber-100 text-amber-800",
        className
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
