import { Search, X } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/catalog.js';

export default function CatalogToolbar({ query, sort, onSearch, onSort }) {
  return (
    <div className="catalog-toolbar">
      <div className="catalog-search" role="search">
        <Search size={18} aria-hidden="true" />
        <label className="visually-hidden" htmlFor="catalog-search">Знайти сувенір за назвою</label>
        <input id="catalog-search" type="search" value={query} onChange={(event) => onSearch(event.target.value)} placeholder="Знайти сувенір за назвою" maxLength={120} />
        {query && <button type="button" className="icon-button" aria-label="Очистити пошук" onClick={() => onSearch('')}><X size={16} /></button>}
      </div>
      <label className="catalog-sort"><span>Сортування</span><select value={sort} onChange={(event) => onSort(event.target.value)}>{Object.entries(SORT_OPTIONS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
  );
}
