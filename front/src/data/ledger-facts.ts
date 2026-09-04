import type { LedgerFactId } from "./types";

/** The accounting rules of ADR 0002. Figures live in the dictionary too: `0 €` vs `€0`. */
export const LEDGER_FACT_IDS: readonly LedgerFactId[] = [
  "oneHourOneCredit",
  "debitLimit",
  "noMoney",
];
