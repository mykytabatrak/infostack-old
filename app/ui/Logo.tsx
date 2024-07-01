import type { ComponentProps } from "react";

import { cx } from "cva";

export type LogoProps = ComponentProps<"svg">;

export function Logo({ className, ...props }: Readonly<LogoProps>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cx("text-accent-9", className)}
      {...props}
    >
      <path
        d="M21.39 16.122l-8.911-4.86a1 1 0 00-.958 0l-8.912 4.86a1 1 0 000 1.756l8.912 4.86a1 1 0 00.958 0l8.912-4.86a1 1 0 000-1.756z"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M21.39 11.122l-8.911-4.86a1 1 0 00-.958 0l-8.912 4.86a1 1 0 000 1.756l8.912 4.86a1 1 0 00.958 0l8.912-4.86a1 1 0 000-1.756z"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M21.39 6.122l-8.911-4.86a1 1 0 00-.958 0L2.61 6.121a1 1 0 000 1.756l8.912 4.86a1 1 0 00.958 0l8.912-4.86a1 1 0 000-1.756z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
