const formatter = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

export function formatPrice(priceInKopiykas) {
  return `${formatter.format(priceInKopiykas / 100)} грн`;
}
