import Typography from "@mui/material/Typography";
import { TypeScaleListItem, TypeScaleListRoot } from "./TypeScaleList.style";
import {
  describeVariant,
  TYPE_SCALE_VARIANTS,
  typeScaleListClasses,
} from "./TypeScaleList.util";

export default function TypeScaleList({ sample }: { sample: string }) {
  return (
    <TypeScaleListRoot className={typeScaleListClasses.root}>
      {TYPE_SCALE_VARIANTS.map((variant) => (
        <TypeScaleListItem className={typeScaleListClasses.item} key={variant}>
          <div>
            <Typography variant="subtitle2" component="p">
              {variant}
            </Typography>
            <Typography variant="caption" component="p" color="textSecondary">
              {describeVariant(variant)}
            </Typography>
          </div>
          <Typography variant={variant} component="p">
            {sample}
          </Typography>
        </TypeScaleListItem>
      ))}
    </TypeScaleListRoot>
  );
}
