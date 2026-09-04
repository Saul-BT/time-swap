import type { ElementType } from "react";

/**
 * `styled()` drops the `component` prop from a MUI component's type.
 * Intersect a styled slot's props with this to get it back.
 *
 * @example
 * export const CardRoot = styled(Paper, { name: "Card", slot: "Root" })<WithComponent>({});
 * <CardRoot component="article" />
 */
export type WithComponent = { component?: ElementType };

export type WithFormComponent = WithComponent & {
  action?: string;
};
