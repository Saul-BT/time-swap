import { CircleAlert } from "lucide-react";
import { joinClasses } from "@/lib/mui/componentClasses";
import Icon from "../Icon";
import { FieldErrorRoot } from "./FieldError.style";
import { fieldErrorClasses } from "./FieldError.util";

export type FieldErrorProps = {
  /** Listed by the control in `aria-describedby`. */
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/** Reads with an icon so the colour is not the only signal. */
export default function FieldError({
  id,
  className,
  children,
}: FieldErrorProps) {
  return (
    <FieldErrorRoot
      className={joinClasses(fieldErrorClasses.root, className)}
      id={id}
      role="alert"
    >
      <Icon icon={CircleAlert} size="sm" />
      <span>{children}</span>
    </FieldErrorRoot>
  );
}
