export const CATEGORY_LABELS = { postcards: 'Листівки', mugs: 'Чашки', pins: 'Значки', posters: 'Постери' };

export function parsePrice(value) {
  if (value === null || value.trim() === '') return null;
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return NaN;
  const price = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(price) ? price : NaN;
}

export function readCatalogFilters(params, products) {
  const cities = [...new Set(products.map((product) => product.city))];
  const categories = [...new Set(products.map((product) => product.category))];
  let min = parsePrice(params.get('min'));
  let max = parsePrice(params.get('max'));
  if (!Number.isFinite(min)) min = null;
  if (!Number.isFinite(max)) max = null;
  if (min !== null && max !== null && min > max) [min, max] = [max, min];
  return {
    cities: [...new Set(params.getAll('city').filter((city) => cities.includes(city)))],
    categories: [...new Set(params.getAll('category').filter((category) => categories.includes(category)))],
    min, max,
  };
}

export function filterProducts(products, filters) {
  return products.filter((product) =>
    (!filters.cities.length || filters.cities.includes(product.city)) &&
    (!filters.categories.length || filters.categories.includes(product.category)) &&
    (filters.min === null || product.price >= filters.min) &&
    (filters.max === null || product.price <= filters.max));
}

export function updateCatalogParams(previous, changes) {
  const next = new URLSearchParams(previous);
  next.delete('page');
  for (const [key, value] of Object.entries(changes)) {
    next.delete(key);
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) if (item !== null && item !== '') next.append(key, String(item));
  }
  return next;
}
