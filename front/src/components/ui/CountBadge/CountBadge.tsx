import { CountBadgeRoot } from "./CountBadge.style";
import { countBadgeClasses } from "./CountBadge.util";

export type CountBadgeProps = {
  count: number;
  /** Spoken instead of the bare number, e.g. "3 unread". Omit when the context already says it. */
  label?: string;
};

/** Accent square with a count. Renders nothing at zero: an empty badge is noise. */
export default function CountBadge({ count, label }: CountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <CountBadgeRoot
      className={countBadgeClasses.root}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {count}
    </CountBadgeRoot>
  );
}
