import { createComponentClasses } from "@/lib/mui/componentClasses";

export const scaleListClasses = createComponentClasses("ScaleList", [
  "root",
  "item",
  "bar",
]);

export type ScaleEntry = {
  token: string;
  pixels: number;
};
