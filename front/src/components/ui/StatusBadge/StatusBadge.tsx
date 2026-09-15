import { Check } from "lucide-react";
import Icon from "../Icon";
import { StatusBadgeRoot } from "./StatusBadge.style";
import {
  type SectionStatus,
  type StatusTone,
  statusBadgeClasses,
} from "./StatusBadge.util";

export type StatusBadgeProps = {
  status: SectionStatus;
  /** Read by assistive tech in every state; shown only for the pending ones. */
  label: string;
  tone?: StatusTone;
};

/** Section state next to its name: a check when done, a word when something is pending. */
export default function StatusBadge({
  status,
  label,
  tone = "default",
}: StatusBadgeProps) {
  return (
    <StatusBadgeRoot
      className={statusBadgeClasses.root}
      ownerState={{ status, tone }}
    >
      {status === "done" ? (
        <Icon icon={Check} size="sm" label={label} />
      ) : (
        <span className={statusBadgeClasses.text}>{label}</span>
      )}
    </StatusBadgeRoot>
  );
}
