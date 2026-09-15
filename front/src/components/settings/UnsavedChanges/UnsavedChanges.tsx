"use client";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import {
  createContext,
  type SyntheticEvent,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { UnsavedChangesDialog } from "./UnsavedChanges.style";
import {
  type UnsavedChangesCopy,
  unsavedChangesClasses,
} from "./UnsavedChanges.util";

type UnsavedChangesContextValue = {
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  /** Call from a link's `onNavigate`: cancels it and asks when there are changes. */
  guard: (href: string, event: { preventDefault: () => void }) => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(
  null,
);

export type UnsavedChangesProviderProps = {
  copy: UnsavedChangesCopy;
  children: React.ReactNode;
};

/**
 * Tracks whether the open section has unsaved edits and intercepts navigation
 * away from it. Only the open panel is guarded (ADR 0012).
 */
export function UnsavedChangesProvider({
  copy,
  children,
}: UnsavedChangesProviderProps) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const guard: UnsavedChangesContextValue["guard"] = (href, event) => {
    if (!dirty) {
      return;
    }

    event.preventDefault();
    setPendingHref(href);
  };

  const stay = () => setPendingHref(null);

  const leave = () => {
    const href = pendingHref;
    setPendingHref(null);
    setDirty(false);

    if (href) {
      router.push(href);
    }
  };

  return (
    <UnsavedChangesContext.Provider value={{ dirty, setDirty, guard }}>
      {children}
      <UnsavedChangesDialog
        className={unsavedChangesClasses.dialog}
        open={pendingHref !== null}
        onClose={stay}
        aria-labelledby={titleId}
        aria-describedby={bodyId}
      >
        <DialogTitle
          id={titleId}
          className={unsavedChangesClasses.title}
          component="h2"
          variant="h4"
        >
          {copy.title}
        </DialogTitle>
        <DialogContent className={unsavedChangesClasses.body}>
          <Typography id={bodyId} variant="body1">
            {copy.body}
          </Typography>
        </DialogContent>
        <DialogActions className={unsavedChangesClasses.actions}>
          <Button variant="outlined" onClick={leave}>
            {copy.leave}
          </Button>
          <Button variant="contained" onClick={stay} autoFocus>
            {copy.stay}
          </Button>
        </DialogActions>
      </UnsavedChangesDialog>
    </UnsavedChangesContext.Provider>
  );
}

/** Outside a provider the guard is inert, so links keep working on their own. */
export function useUnsavedChanges(): UnsavedChangesContextValue {
  const context = useContext(UnsavedChangesContext);

  return (
    context ?? {
      dirty: false,
      setDirty: () => {},
      guard: () => {},
    }
  );
}

export type GuardedNavigateEvent = SyntheticEvent & {
  preventDefault: () => void;
};
