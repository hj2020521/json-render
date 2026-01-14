"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Link({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);

  return (
    <span
      className={`text-xs text-blue-500 underline cursor-pointer ${baseClass} ${customClass}`}
    >
      {props.label as string}
    </span>
  );
}
