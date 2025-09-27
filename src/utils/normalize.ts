export function normalizeLang(s?: string) {
  return s?.toLowerCase().slice(0, 2) || undefined;
}
