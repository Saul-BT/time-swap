"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type ErrorCopy, FALLBACK_ERROR_COPY } from "./ErrorCopy.util";

const ErrorCopyContext = createContext<ErrorCopy>(FALLBACK_ERROR_COPY);

export type ErrorCopyProviderProps = {
  copy: ErrorCopy;
  children: ReactNode;
};

/**
 * Carries the error strings down to the boundaries. An `error.tsx` is a client
 * component by definition, so it cannot call `getDictionary()`; the copy has to
 * arrive from a server component that can.
 */
export function ErrorCopyProvider({ copy, children }: ErrorCopyProviderProps) {
  return (
    <ErrorCopyContext.Provider value={copy}>
      {children}
    </ErrorCopyContext.Provider>
  );
}

/** Falls back to Spanish when the boundary sits above the provider. */
export function useErrorCopy(): ErrorCopy {
  return useContext(ErrorCopyContext);
}
