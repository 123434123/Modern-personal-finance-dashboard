// Currency + number formatting helpers.
// All figures in the app are stored as plain numbers in USD-equivalent scale;
// formatting only affects display, so switching currency never mutates data.

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
  EGP: { code: 'EGP', symbol: 'E£', locale: 'ar-EG' },
};

export function formatCurrency(amount, currencyCode = 'USD', options = {}) {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const value = Number.isFinite(amount) ? amount : 0;
  const { maximumFractionDigits = 2, minimumFractionDigits = 2, signDisplay } = options;

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits,
      minimumFractionDigits,
      ...(signDisplay ? { signDisplay } : {}),
    }).format(value);
  } catch {
    return `${currency.symbol}${value.toFixed(2)}`;
  }
}

export function formatSignedCurrency(amount, currencyCode = 'USD') {
  const sign = amount > 0 ? '+' : amount < 0 ? '−' : '';
  return `${sign}${formatCurrency(Math.abs(amount), currencyCode)}`;
}

export function formatNumber(value, options = {}) {
  const num = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatPercent(value, { maximumFractionDigits = 0 } = {}) {
  const num = Number.isFinite(value) ? value : 0;
  return `${num.toFixed(maximumFractionDigits)}%`;
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function titleCase(str = '') {
  return str.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
}
