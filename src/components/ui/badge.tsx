import clsx from "clsx";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "success" | "error" | "default";
}

const Badge = ({ children, size = "sm", color = "default" }: BadgeProps) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const colorClasses = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={clsx(
        "inline-block rounded-full font-medium",
        sizeClasses[size],
        colorClasses[color]
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
