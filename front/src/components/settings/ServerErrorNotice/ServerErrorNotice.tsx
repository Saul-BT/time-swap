"use client";

import Button from "@mui/material/Button";
import { useEffect, useRef } from "react";
import FormNotice from "../../ui/FormNotice";
import { ServerErrorNoticeRoot } from "./ServerErrorNotice.style";
import {
  type ServerErrorCopy,
  serverErrorNoticeClasses,
} from "./ServerErrorNotice.util";

export type ServerErrorNoticeProps = {
  copy: ServerErrorCopy;
  onRetry: () => void;
  disabled?: boolean;
};

/** Recoverable failure: the values stay in the form and one button resubmits. */
export default function ServerErrorNotice({
  copy,
  onRetry,
  disabled,
}: ServerErrorNoticeProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    root.current?.focus();
  }, []);

  return (
    <ServerErrorNoticeRoot
      ref={root}
      className={serverErrorNoticeClasses.root}
      tabIndex={-1}
    >
      <FormNotice
        tone="error"
        title={copy.title}
        action={
          <Button
            className={serverErrorNoticeClasses.retry}
            variant="outlined"
            type="button"
            onClick={onRetry}
            disabled={disabled}
          >
            {copy.retry}
          </Button>
        }
      >
        {copy.body}
      </FormNotice>
    </ServerErrorNoticeRoot>
  );
}
