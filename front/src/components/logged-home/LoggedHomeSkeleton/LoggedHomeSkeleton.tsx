import { getDictionary } from "@/i18n/dictionary";
import BoardSectionHead from "../BoardSectionHead";
import {
  LoggedHomeSkeletonBar,
  LoggedHomeSkeletonColumn,
  LoggedHomeSkeletonDay,
  LoggedHomeSkeletonHeading,
  LoggedHomeSkeletonRoot,
  LoggedHomeSkeletonRow,
  LoggedHomeSkeletonStatus,
  LoggedHomeSkeletonWeek,
} from "./LoggedHomeSkeleton.style";
import {
  loggedHomeSkeletonClasses,
  SKELETON_ROWS,
} from "./LoggedHomeSkeleton.util";

const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const ROWS = Array.from(
  { length: SKELETON_ROWS },
  (_, index) => `row-${index}`,
);

function Rows() {
  return ROWS.map((id) => (
    <LoggedHomeSkeletonRow key={id} className={loggedHomeSkeletonClasses.row}>
      <LoggedHomeSkeletonBar
        className={loggedHomeSkeletonClasses.bar}
        ownerState={{ width: 44, height: 44 }}
      />
      <LoggedHomeSkeletonBar
        className={loggedHomeSkeletonClasses.bar}
        ownerState={{ width: "70%", height: 44 }}
      />
    </LoggedHomeSkeletonRow>
  ));
}

/** Titles paint at once; only the data waits. */
export default async function LoggedHomeSkeleton() {
  const { loggedHome } = await getDictionary();

  return (
    <LoggedHomeSkeletonRoot
      className={loggedHomeSkeletonClasses.root}
      aria-busy="true"
    >
      <LoggedHomeSkeletonStatus
        className={loggedHomeSkeletonClasses.status}
        role="status"
      >
        {loggedHome.loading}
      </LoggedHomeSkeletonStatus>
      <LoggedHomeSkeletonHeading className={loggedHomeSkeletonClasses.heading}>
        <LoggedHomeSkeletonBar
          className={loggedHomeSkeletonClasses.bar}
          ownerState={{ width: 360, height: 48 }}
        />
        <LoggedHomeSkeletonBar
          className={loggedHomeSkeletonClasses.bar}
          ownerState={{ width: 220, height: 16 }}
        />
      </LoggedHomeSkeletonHeading>
      <LoggedHomeSkeletonWeek
        className={loggedHomeSkeletonClasses.week}
        aria-hidden
      >
        {WEEK.map((day) => (
          <LoggedHomeSkeletonDay
            key={day}
            className={loggedHomeSkeletonClasses.day}
          />
        ))}
      </LoggedHomeSkeletonWeek>
      <LoggedHomeSkeletonColumn
        className={loggedHomeSkeletonClasses.pending}
        ownerState={{ area: "pending" }}
      >
        <BoardSectionHead
          id="pending-skeleton"
          title={loggedHome.pending.title}
        />
        <Rows />
      </LoggedHomeSkeletonColumn>
      <LoggedHomeSkeletonColumn
        className={loggedHomeSkeletonClasses.aside}
        ownerState={{ area: "aside" }}
      >
        <BoardSectionHead
          id="waiting-skeleton"
          title={loggedHome.waiting.title}
        />
        <Rows />
      </LoggedHomeSkeletonColumn>
    </LoggedHomeSkeletonRoot>
  );
}
