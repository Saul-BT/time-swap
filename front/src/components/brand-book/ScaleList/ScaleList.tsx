import Typography from "@mui/material/Typography";
import { ScaleBar, ScaleListItem, ScaleListRoot } from "./ScaleList.style";
import { type ScaleEntry, scaleListClasses } from "./ScaleList.util";

export default function ScaleList({
  entries,
}: {
  entries: readonly ScaleEntry[];
}) {
  return (
    <ScaleListRoot className={scaleListClasses.root}>
      {entries.map((entry) => (
        <ScaleListItem className={scaleListClasses.item} key={entry.token}>
          <ScaleBar
            className={scaleListClasses.bar}
            style={{ width: entry.pixels }}
          />
          <Typography variant="subtitle2" component="p" color="textSecondary">
            {entry.token} · {entry.pixels}px
          </Typography>
        </ScaleListItem>
      ))}
    </ScaleListRoot>
  );
}
