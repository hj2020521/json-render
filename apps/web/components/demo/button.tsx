"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Button({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const variant = props.variant as string;
  const btnClass =
    variant === "danger"
      ? "bg-red-500 text-white"
      : variant === "secondary"
        ? "bg-card border border-border text-foreground"
        : "bg-foreground text-background";

  return (
    <button
      onClick={() =>
        (window as unknown as { __demoAction?: () => void }).__demoAction?.()
      }
      className={`self-start px-3 py-1.5 rounded text-xs font-medium hover:opacity-90 transition-opacity ${btnClass} ${baseClass} ${customClass}`}
    >
      {props.label as string}
    </button>
  );
}
