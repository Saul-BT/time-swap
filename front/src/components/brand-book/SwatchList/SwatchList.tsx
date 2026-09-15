import Typography from "@mui/material/Typography";
import { contrastRatio, formatContrastRatio } from "@/lib/color/contrast";
import { SwatchListRoot, SwatchSample } from "./SwatchList.style";
import { SWATCHES, swatchListClasses } from "./SwatchList.util";

export default function SwatchList() {
  return (
    <SwatchListRoot className={swatchListClasses.root}>
      {SWATCHES.map((swatch) => (
        <li className={swatchListClasses.item} key={swatch.token}>
          <SwatchSample
            className={swatchListClasses.sample}
            style={{ backgroundColor: swatch.value }}
          />
          <Typography variant="h6" component="p">
            {swatch.token}
          </Typography>
          <Typography variant="caption" component="p" color="textSecondary">
            {swatch.value}
            {swatch.measuredAgainst
              ? ` · ${formatContrastRatio(contrastRatio(swatch.value, swatch.measuredAgainst), "en")}`
              : ""}
          </Typography>
        </li>
      ))}
    </SwatchListRoot>
  );
}
