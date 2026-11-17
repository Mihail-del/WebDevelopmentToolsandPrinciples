import { useState } from 'react';
import { CATEGORY_LABELS, parsePrice } from '../../utils/catalog.js';

function PriceFilter({ min, max, onApply }) {
  const [from, setFrom] = useState(min === null ? '' : String(min / 100));
  const [to, setTo] = useState(max === null ? '' : String(max / 100));
  const lower = parsePrice(from);
  const upper = parsePrice(to);
  const invalid = Number.isNaN(lower) || Number.isNaN(upper);
  const reversed = lower !== null && upper !== null && lower > upper;
  const error = invalid ? 'Вкажіть ціну від 0, не більше двох знаків після коми.' : reversed ? 'Ціна «від» має бути меншою або дорівнювати ціні «до».' : '';

  return (
    <form className="price-filter" onSubmit={(event) => { event.preventDefault(); if (!error) onApply({ min: lower === null ? null : lower / 100, max: upper === null ? null : upper / 100 }); }}>
      <fieldset>
        <legend>Ціна, грн</legend>
        <div className="price-filter__inputs">
          <label>Від<input inputMode="decimal" value={from} onChange={(event) => setFrom(event.target.value)} placeholder="0" aria-invalid={Boolean(error)} aria-describedby={error ? 'price-error' : undefined} /></label>
          <label>До<input inputMode="decimal" value={to} onChange={(event) => setTo(event.target.value)} placeholder="Будь-яка" aria-invalid={Boolean(error)} aria-describedby={error ? 'price-error' : undefined} /></label>
        </div>
        {error && <p id="price-error" className="filter-error" role="alert">{error}</p>}
        <button className="button button--outline" disabled={Boolean(error)} type="submit">Застосувати ціну</button>
      </fieldset>
    </form>
  );
}

export default function CatalogFilters({ products, filters, onChange, onReset }) {
  const cities = [...new Set(products.map((product) => product.city))].sort((a, b) => a.localeCompare(b, 'uk'));
  const categories = Object.keys(CATEGORY_LABELS).filter((category) => products.some((product) => product.category === category));
  const toggle = (values, value) => values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  return (
    <aside className="catalog-filters" aria-label="Фільтри товарів">
      <fieldset><legend>Місто</legend>
        {cities.map((city) => <label className="filter-option" key={city}><input type="checkbox" checked={filters.cities.includes(city)} onChange={() => onChange({ city: toggle(filters.cities, city) })} /><span>{city}</span><small>{products.filter((product) => product.city === city).length}</small></label>)}
      </fieldset>
      <fieldset><legend>Категорія</legend>
        {categories.map((category) => <label className="filter-option" key={category}><input type="checkbox" checked={filters.categories.includes(category)} onChange={() => onChange({ category: toggle(filters.categories, category) })} /><span>{CATEGORY_LABELS[category]}</span><small>{products.filter((product) => product.category === category).length}</small></label>)}
      </fieldset>
      <PriceFilter key={`${filters.min}:${filters.max}`} min={filters.min} max={filters.max} onApply={onChange} />
      <button className="filter-reset" type="button" onClick={onReset}>Скинути фільтри</button>
    </aside>
  );
}
