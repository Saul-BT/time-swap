import Skeleton from "@mui/material/Skeleton";
import { structure } from "@/theme/tokens";
import {
  PanelSkeletonFoot,
  PanelSkeletonGroup,
  PanelSkeletonRoot,
} from "./PanelSkeleton.style";
import { panelSkeletonClasses } from "./PanelSkeleton.util";

export type PanelSkeletonProps = {
  /** Controls the panel will show, one 52 px block each. */
  rows: number;
  /** Accessible name announced while the panel loads. */
  label: string;
};

/** Loading state of a section: the panel's structure in line grey, no spinner. */
export default function PanelSkeleton({ rows, label }: PanelSkeletonProps) {
  return (
    <PanelSkeletonRoot
      className={panelSkeletonClasses.root}
      role="status"
      aria-label={label}
      aria-busy
    >
      <PanelSkeletonGroup className={panelSkeletonClasses.head}>
        <Skeleton variant="text" width={120} sx={{ fontSize: 12 }} />
        <Skeleton variant="text" width="45%" sx={{ fontSize: 40 }} />
        <Skeleton variant="text" width="70%" />
      </PanelSkeletonGroup>
      <PanelSkeletonGroup className={panelSkeletonClasses.rows}>
        {Array.from({ length: rows }, (_, index) => `row-${index}`).map(
          (id) => (
            <Skeleton
              key={id}
              variant="rectangular"
              height={structure.controlHeight}
            />
          ),
        )}
      </PanelSkeletonGroup>
      <PanelSkeletonFoot className={panelSkeletonClasses.foot}>
        <Skeleton
          variant="rectangular"
          width={220}
          height={structure.controlHeight}
        />
        <Skeleton
          variant="rectangular"
          width={220}
          height={structure.controlHeight}
        />
      </PanelSkeletonFoot>
    </PanelSkeletonRoot>
  );
}
