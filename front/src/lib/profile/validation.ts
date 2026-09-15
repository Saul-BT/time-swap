/**
 * Phone-like runs (digits, with `X` placeholders allowed, spaces, dots or
 * dashes) and e-mail addresses. Contact data is shared in the chat once a
 * request is accepted, never in the bio (ADR 0003, ADR 0013).
 */
const CONTACT_DATA_PATTERN =
  /(\+?\d[\dX][\dX\s.-]{5,}[\dX])|([\w.+-]+@[\w-]+\.[\w.]+)/i;

export function containsContactData(text: string): boolean {
  return CONTACT_DATA_PATTERN.test(text);
}
