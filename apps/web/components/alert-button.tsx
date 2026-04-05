"use client";

import type { ReactNode } from "react";

interface AlertButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export function AlertButton({ children, className, appName }: AlertButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
}
