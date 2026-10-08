import { Button, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import Icon from "@/components/ui/Icon";
import IconBox, { type IconBoxTone } from "@/components/ui/IconBox";
import Tag, { type TagTone } from "@/components/ui/Tag";
import {
  PendingRowActions,
  PendingRowAlert,
  PendingRowAlertTitle,
  PendingRowBody,
  PendingRowButtons,
  PendingRowIcon,
  PendingRowLabel,
  PendingRowMeta,
  PendingRowReason,
  PendingRowRoot,
  PendingRowTitle,
} from "./PendingRow.style";
import { pendingRowClasses } from "./PendingRow.util";

export type PendingRowAction = { label: string; primary?: boolean };

export type PendingRowProps = {
  icon: LucideIcon;
  iconTone?: IconBoxTone;
  label: string;
  isNew?: boolean;
  /** When it is due, or that it has no date. */
  day: { text: string; tone: TagTone; icon: LucideIcon };
  title: string;
  detail: string;
  meta: string;
  actions: readonly PendingRowAction[];
  /** The counterpart replaced what is on screen. */
  alert?: { title: string; body: string };
  /** Disables every action and says why, next to them. */
  blocked?: { id: string; reason: string };
};

/** One thing the member has to do: what, with whom, by when, and the buttons to do it. */
export default function PendingRow({
  icon,
  iconTone = "plain",
  label,
  isNew = false,
  day,
  title,
  detail,
  meta,
  actions,
  alert,
  blocked,
}: PendingRowProps) {
  return (
    <PendingRowRoot className={pendingRowClasses.root}>
      <PendingRowIcon className={pendingRowClasses.icon}>
        <IconBox icon={icon} tone={iconTone} />
      </PendingRowIcon>
      <PendingRowLabel
        className={pendingRowClasses.label}
        ownerState={{ isNew }}
      >
        {label}
      </PendingRowLabel>
      <PendingRowMeta
        className={pendingRowClasses.meta}
        variant="caption"
        component="p"
      >
        {meta}
      </PendingRowMeta>

      <PendingRowBody className={pendingRowClasses.body}>
        <Tag tone={day.tone} icon={day.icon}>
          {day.text}
        </Tag>
        <PendingRowTitle
          className={pendingRowClasses.title}
          variant="h5"
          component="h3"
        >
          {title}
        </PendingRowTitle>
        <Typography
          className={pendingRowClasses.detail}
          variant="body2"
          color="textSecondary"
        >
          {detail}
        </Typography>
        {alert ? (
          <PendingRowAlert className={pendingRowClasses.alert} role="status">
            <PendingRowAlertTitle
              className={pendingRowClasses.alertTitle}
              variant="body2"
            >
              {alert.title}
            </PendingRowAlertTitle>
            <Typography variant="body2">{alert.body}</Typography>
          </PendingRowAlert>
        ) : null}
      </PendingRowBody>

      <PendingRowActions className={pendingRowClasses.actions}>
        {/* TODO(api): each action opens its flow once agreements, chat and ratings exist. */}
        <PendingRowButtons className={pendingRowClasses.buttons}>
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.primary ? "contained" : "outlined"}
              size="small"
              disabled={Boolean(blocked)}
              aria-describedby={blocked?.id}
            >
              {action.label}
            </Button>
          ))}
        </PendingRowButtons>
        {blocked ? (
          <PendingRowReason
            className={pendingRowClasses.reason}
            id={blocked.id}
            variant="caption"
          >
            <Icon icon={Lock} size="sm" />
            {blocked.reason}
          </PendingRowReason>
        ) : null}
      </PendingRowActions>
    </PendingRowRoot>
  );
}
