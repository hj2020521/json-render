"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Radio({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const options = (props.options as string[]) || [];

  return (
    <div className={`space-y-1 ${baseClass} ${customClass}`}>
      {props.label ? (
        <div className="text-[10px] text-muted-foreground mb-1 text-left">
          {props.label as string}
        </div>
      ) : null}
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-2 text-xs">
          <div
            className={`w-3.5 h-3.5 border border-border rounded-full ${i === 0 ? "bg-foreground" : "bg-card"}`}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
