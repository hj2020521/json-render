"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Checkbox({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);

  return (
    <label
      className={`flex items-center gap-2 text-xs ${baseClass} ${customClass}`}
    >
      <div
        className={`w-3.5 h-3.5 border border-border rounded-sm ${props.checked ? "bg-foreground" : "bg-card"}`}
      />
      {props.label as string}
    </label>
  );
}
