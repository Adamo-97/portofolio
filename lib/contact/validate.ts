export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MAX = 1000;

const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

// Extra heuristics on top of regex:
// - TLD must be 2–24 letters
// - ban very common typo '.con'
function passesHeuristics(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const host = email.slice(at + 1).toLowerCase();
  const labels = host.split(".");
  const tld = labels[labels.length - 1] || "";
  if (!/^[a-z]{2,24}$/.test(tld)) return false;
  if (tld === "con") return false; // catch 'gmail.con' typo
  return true;
}

export function isValidEmail(s: string): boolean {
  if (!s) return false;
  if (s.length > EMAIL_MAX) return false;
  if (!EMAIL_RE.test(s)) return false;
  return passesHeuristics(s);
}

export function clamp(s: string, max: number) {
  return (s ?? "").toString().slice(0, max);
}
