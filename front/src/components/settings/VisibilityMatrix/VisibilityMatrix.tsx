import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Check } from "lucide-react";
import { REVEALABLE_FIELDS } from "@/data/settings";
import { REVEAL_ORDER, type RevealableField } from "@/data/types";
import { interpolate } from "@/lib/i18n/interpolate";
import Icon from "../../ui/Icon";
import MatrixEditLink from "./MatrixEditLink";
import {
  VisibilityMatrixCell,
  VisibilityMatrixEmpty,
  VisibilityMatrixFixed,
  VisibilityMatrixFootnote,
  VisibilityMatrixLegend,
  VisibilityMatrixLegendItem,
  VisibilityMatrixMomentFull,
  VisibilityMatrixMomentShort,
  VisibilityMatrixRoot,
  VisibilityMatrixRowHead,
} from "./VisibilityMatrix.style";
import {
  isVisibleAt,
  type RevealMap,
  type VisibilityMatrixCopy,
  visibilityMatrixClasses,
} from "./VisibilityMatrix.util";

export type VisibilityMatrixProps = {
  copy: VisibilityMatrixCopy;
  value: RevealMap;
  /** Localized path of the section that owns each row. */
  editHref: Record<RevealableField, string>;
};

const FIXED_ROWS = ["nameAndModality", "district"] as const;

/** Read only: the moment is chosen in the section that owns the data (ADR 0013). */
export default function VisibilityMatrix({
  copy,
  value,
  editHref,
}: VisibilityMatrixProps) {
  return (
    <div>
      <VisibilityMatrixRoot className={visibilityMatrixClasses.root}>
        <Table
          className={visibilityMatrixClasses.table}
          aria-label={copy.label}
        >
          <TableHead>
            <TableRow>
              <TableCell>{copy.dataHeader}</TableCell>
              {REVEAL_ORDER.map((moment) => (
                <TableCell key={moment} align="center">
                  <VisibilityMatrixMomentShort
                    className={visibilityMatrixClasses.momentShort}
                    aria-hidden
                  >
                    {copy.momentsShort[moment]}
                  </VisibilityMatrixMomentShort>
                  <VisibilityMatrixMomentFull
                    className={visibilityMatrixClasses.momentFull}
                  >
                    {copy.moments[moment]}
                  </VisibilityMatrixMomentFull>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {FIXED_ROWS.map((row) => (
              <TableRow key={row}>
                <VisibilityMatrixRowHead
                  className={visibilityMatrixClasses.rowHead}
                  component="th"
                  scope="row"
                >
                  {copy.rows[row]}
                  <VisibilityMatrixFixed
                    className={visibilityMatrixClasses.fixed}
                  >
                    {copy.fixed}
                  </VisibilityMatrixFixed>
                </VisibilityMatrixRowHead>
                {REVEAL_ORDER.map((moment) => (
                  <VisibilityMatrixCell
                    key={moment}
                    className={visibilityMatrixClasses.cell}
                  >
                    <Icon
                      icon={Check}
                      size="sm"
                      label={interpolate(copy.cellLabel, {
                        field: copy.rows[row],
                        moment: copy.moments[moment],
                      })}
                    />
                  </VisibilityMatrixCell>
                ))}
              </TableRow>
            ))}

            {REVEALABLE_FIELDS.map((field) => (
              <TableRow key={field}>
                <VisibilityMatrixRowHead
                  className={visibilityMatrixClasses.rowHead}
                  component="th"
                  scope="row"
                >
                  <MatrixEditLink
                    href={editHref[field]}
                    label={interpolate(copy.change, {
                      field: copy.rows[field],
                    })}
                  >
                    {copy.rows[field]}
                  </MatrixEditLink>
                </VisibilityMatrixRowHead>
                {REVEAL_ORDER.map((moment) => (
                  <VisibilityMatrixCell
                    key={moment}
                    className={visibilityMatrixClasses.cell}
                  >
                    {isVisibleAt(value[field], moment) ? (
                      <Icon
                        icon={Check}
                        size="sm"
                        label={interpolate(copy.cellLabel, {
                          field: copy.rows[field],
                          moment: copy.moments[moment],
                        })}
                      />
                    ) : (
                      <VisibilityMatrixEmpty
                        className={visibilityMatrixClasses.empty}
                        aria-hidden
                      >
                        —
                      </VisibilityMatrixEmpty>
                    )}
                  </VisibilityMatrixCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <VisibilityMatrixRowHead
                className={visibilityMatrixClasses.rowHead}
                component="th"
                scope="row"
              >
                {copy.rows.contact}
              </VisibilityMatrixRowHead>
              <VisibilityMatrixCell
                className={visibilityMatrixClasses.never}
                colSpan={REVEAL_ORDER.length}
              >
                {copy.never}
              </VisibilityMatrixCell>
            </TableRow>
          </TableBody>
        </Table>
      </VisibilityMatrixRoot>
      <VisibilityMatrixLegend className={visibilityMatrixClasses.legend}>
        {REVEAL_ORDER.map((moment) => (
          <VisibilityMatrixLegendItem
            key={moment}
            className={visibilityMatrixClasses.legendItem}
          >
            <dt>{copy.momentsShort[moment]}</dt>
            <dd>{copy.moments[moment]}</dd>
          </VisibilityMatrixLegendItem>
        ))}
      </VisibilityMatrixLegend>
      <VisibilityMatrixFootnote className={visibilityMatrixClasses.footnote}>
        {copy.footnote}
      </VisibilityMatrixFootnote>
    </div>
  );
}
