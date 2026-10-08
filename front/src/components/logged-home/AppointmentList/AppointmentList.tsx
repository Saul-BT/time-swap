import { Typography } from "@mui/material";
import { useId } from "react";
import BoardSectionHead from "../BoardSectionHead";
import {
  AppointmentListDate,
  AppointmentListDay,
  AppointmentListItem,
  AppointmentListList,
  AppointmentListRoot,
  AppointmentListText,
  AppointmentListTitle,
  AppointmentListWeekday,
} from "./AppointmentList.style";
import { appointmentListClasses } from "./AppointmentList.util";

export type AppointmentListEntry = {
  id: string;
  weekday: string;
  day: number;
  title: string;
  detail: string;
};

export type AppointmentListProps = {
  title: string;
  entries: readonly AppointmentListEntry[];
};

export default function AppointmentList({
  title,
  entries,
}: AppointmentListProps) {
  const titleId = useId();

  if (entries.length === 0) {
    return null;
  }

  return (
    <AppointmentListRoot
      className={appointmentListClasses.root}
      aria-labelledby={titleId}
    >
      <BoardSectionHead id={titleId} title={title} count={entries.length} />
      <AppointmentListList className={appointmentListClasses.list}>
        {entries.map((entry) => (
          <AppointmentListItem
            key={entry.id}
            className={appointmentListClasses.item}
          >
            <AppointmentListDate className={appointmentListClasses.date}>
              <AppointmentListWeekday
                className={appointmentListClasses.weekday}
              >
                {entry.weekday}
              </AppointmentListWeekday>
              <AppointmentListDay
                className={appointmentListClasses.day}
                component="p"
              >
                {entry.day}
              </AppointmentListDay>
            </AppointmentListDate>
            <AppointmentListText className={appointmentListClasses.text}>
              <AppointmentListTitle
                className={appointmentListClasses.title}
                variant="body1"
              >
                {entry.title}
              </AppointmentListTitle>
              <Typography variant="caption" component="p" color="textSecondary">
                {entry.detail}
              </Typography>
            </AppointmentListText>
          </AppointmentListItem>
        ))}
      </AppointmentListList>
    </AppointmentListRoot>
  );
}
