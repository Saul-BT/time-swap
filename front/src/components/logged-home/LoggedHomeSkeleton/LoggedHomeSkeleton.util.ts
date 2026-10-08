import { createComponentClasses } from "@/lib/mui/componentClasses";

export const SKELETON_ROWS = 3;

export const loggedHomeSkeletonClasses = createComponentClasses(
  "LoggedHomeSkeleton",
  [
    "root",
    "status",
    "heading",
    "week",
    "day",
    "pending",
    "aside",
    "row",
    "bar",
  ],
);
