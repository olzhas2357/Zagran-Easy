export const CURRENCY_OPTIONS = [
  { code: "USD", label: "USD — доллар США" },
  { code: "EUR", label: "EUR — евро" },
  { code: "TRY", label: "TRY — турецкая лира" },
  { code: "CNY", label: "CNY — китайский юань" },
  { code: "KZT", label: "KZT — казахстанский тенге" },
  { code: "GBP", label: "GBP — британский фунт" },
  { code: "KRW", label: "KRW — южнокорейская вона" },
  { code: "JPY", label: "JPY — японская иена" },
  { code: "AED", label: "AED — дирхам ОАЭ" },
] as const;

export function normalizeCurrency(value: unknown, fallback = "USD"): string {
  const currency = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^[A-Z]{3}$/.test(currency) ? currency : fallback;
}

export function formatCurrency(amount: number, currency = "USD"): string {
  const normalizedCurrency = normalizeCurrency(currency);
  const maximumFractionDigits = Number.isInteger(amount) ? 0 : 2;

  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: normalizedCurrency,
      currencyDisplay: "code",
      minimumFractionDigits: 0,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("ru-RU", { maximumFractionDigits })} ${normalizedCurrency}`;
  }
}
