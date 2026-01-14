"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Switch({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);

  return (
    <label
      className={`flex items-center justify-between gap-2 text-xs ${baseClass} ${customClass}`}
    >
      <span>{props.label as string}</span>
      <div
        className={`w-8 h-4 rounded-full relative ${props.checked ? "bg-foreground" : "bg-border"}`}
      >
        <div
          className={`absolute w-3 h-3 rounded-full bg-background top-0.5 transition-all ${props.checked ? "right-0.5" : "left-0.5"}`}
        />
      </div>
    </label>
  );
}
