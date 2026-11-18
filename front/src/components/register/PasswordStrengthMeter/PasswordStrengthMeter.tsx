import { interpolate } from "@/lib/i18n/interpolate";
import {
  PasswordStrengthMeterLabel,
  PasswordStrengthMeterRoot,
  PasswordStrengthMeterSegment,
  PasswordStrengthMeterTrack,
} from "./PasswordStrengthMeter.style";
import {
  getStrengthTone,
  passwordStrengthMeterClasses,
  STRENGTH_SEGMENT_COUNT,
  scorePassword,
} from "./PasswordStrengthMeter.util";

export type PasswordStrengthMeterProps = {
  password: string;
  /** One label per score, 0 to 4, in the caller's locale. */
  levels: readonly [string, string, string, string, string];
  ariaLabel: string;
  /** Must contain a `{level}` placeholder. */
  ariaLabelWithLevel: string;
};

/** Fixed, order-stable identity for the four segments — never re-derived from index. */
const SEGMENTS = Array.from(
  { length: STRENGTH_SEGMENT_COUNT },
  (_, index) => `segment-${index}`,
);

/** Live read-out of `scorePassword`. Silent while the field is empty. */
export default function PasswordStrengthMeter({
  password,
  levels,
  ariaLabel,
  ariaLabelWithLevel,
}: PasswordStrengthMeterProps) {
  const score = scorePassword(password);
  const tone = getStrengthTone(score);
  const label = levels[score];

  return (
    <PasswordStrengthMeterRoot className={passwordStrengthMeterClasses.root}>
      <PasswordStrengthMeterTrack
        className={passwordStrengthMeterClasses.track}
        role="img"
        aria-label={
          password
            ? interpolate(ariaLabelWithLevel, { level: label })
            : ariaLabel
        }
      >
        {SEGMENTS.map((key, index) => (
          <PasswordStrengthMeterSegment
            key={key}
            className={passwordStrengthMeterClasses.segment}
            ownerState={{ filled: index < score, tone }}
          />
        ))}
      </PasswordStrengthMeterTrack>
      {password ? (
        <PasswordStrengthMeterLabel
          className={passwordStrengthMeterClasses.label}
          variant="caption"
          ownerState={{ tone }}
        >
          {label}
        </PasswordStrengthMeterLabel>
      ) : null}
    </PasswordStrengthMeterRoot>
  );
}
