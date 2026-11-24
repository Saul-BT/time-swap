import { Link, Typography } from "@mui/material";
import Eyebrow from "@/components/ui/Eyebrow";
import { DEBIT_LIMIT_HOURS } from "@/data/ledger-facts";
import { getDictionary } from "@/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import {
  BalanceSummaryFigure,
  BalanceSummaryFigureRow,
  BalanceSummaryHeadroom,
  BalanceSummaryRoot,
} from "./BalanceSummary.style";
import {
  type BalanceSummaryVariant,
  balanceSummaryClasses,
  formatSignedHours,
} from "./BalanceSummary.util";

export type BalanceSummaryProps = {
  hours: number;
  variant: BalanceSummaryVariant;
};

const FIGURE_VARIANT = { wide: "h2", compact: "body2", intro: "h1" } as const;

/** The balance and how much more the member may still receive (ADR 0002). */
export default async function BalanceSummary({
  hours,
  variant,
}: BalanceSummaryProps) {
  const { loggedHome } = await getDictionary();
  const { balance } = loggedHome;
  const headroom = interpolate(balance.hours, {
    hours: hours + DEBIT_LIMIT_HOURS,
  });

  return (
    <BalanceSummaryRoot
      className={balanceSummaryClasses.root}
      ownerState={{ variant }}
    >
      <BalanceSummaryFigureRow
        className={balanceSummaryClasses.figureRow}
        ownerState={{ variant }}
      >
        <Eyebrow component="span">
          {variant === "compact" ? balance.shortLabel : balance.label}
        </Eyebrow>
        <BalanceSummaryFigure
          className={balanceSummaryClasses.figure}
          ownerState={{ positive: hours > 0 }}
          variant={FIGURE_VARIANT[variant]}
          component="span"
        >
          {interpolate(balance.hours, { hours: formatSignedHours(hours) })}
        </BalanceSummaryFigure>
      </BalanceSummaryFigureRow>

      {variant === "wide" ? (
        <Typography
          className={balanceSummaryClasses.note}
          variant="caption"
          component="p"
          color="textSecondary"
        >
          {balance.canReceive.before}
          <BalanceSummaryHeadroom className={balanceSummaryClasses.headroom}>
            {headroom}
          </BalanceSummaryHeadroom>
          {balance.canReceive.after} ·{" "}
          {/* TODO(routes): point at the wallet once it has a page. */}
          <Link href="#" variant="caption">
            {balance.wallet}
          </Link>
        </Typography>
      ) : null}

      {variant === "intro" ? (
        <Typography
          className={balanceSummaryClasses.note}
          variant="body2"
          color="textSecondary"
        >
          {interpolate(balance.canReceiveFirstTime, { hours: headroom })}
        </Typography>
      ) : null}
    </BalanceSummaryRoot>
  );
}
