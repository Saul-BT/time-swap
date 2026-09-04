"use client";

import NextLink, { type LinkProps } from "next/link";
import type { ComponentPropsWithRef } from "react";

type LinkBehaviorProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  href: LinkProps["href"];
};

/** Adapter so MUI's `href` props render a `next/link` instead of a bare anchor. */
export default function LinkBehavior({ href, ...props }: LinkBehaviorProps) {
  return <NextLink href={href} {...props} />;
}
