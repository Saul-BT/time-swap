import { CharacterCountRoot } from "./CharacterCount.style";
import { characterCountClasses } from "./CharacterCount.util";

export type CharacterCountProps = {
  id?: string;
  count: number;
  max: number;
  /** Already formatted, such as `"164 / 600"`; the separator is code, not copy. */
  children: React.ReactNode;
};

/** Live counter under a bounded field. Turns to error past the limit; never blocks typing. */
export default function CharacterCount({
  id,
  count,
  max,
  children,
}: CharacterCountProps) {
  return (
    <CharacterCountRoot
      id={id}
      className={characterCountClasses.root}
      ownerState={{ over: count > max }}
      variant="caption"
      aria-live="polite"
    >
      {children}
    </CharacterCountRoot>
  );
}
