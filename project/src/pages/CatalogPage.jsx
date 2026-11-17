import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import products from '../data/products.json';
import ProductCard from '../components/catalog/ProductCard.jsx';
import CatalogFilters from '../components/catalog/CatalogFilters.jsx';
import CatalogToolbar from '../components/catalog/CatalogToolbar.jsx';
import { filterProducts, readCatalogFilters, updateCatalogParams, searchProducts, sortProducts, SORT_OPTIONS } from '../utils/catalog.js';
import './CatalogPage.scss';

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = readCatalogFilters(params, products);
  const query = params.get('q') ?? '';
  const sort = Object.hasOwn(SORT_OPTIONS, params.get('sort')) ? params.get('sort') : 'recommended';
  const visible = sortProducts(searchProducts(filterProducts(products, filters), query), sort);
  const changeFilters = (changes) => setParams((previous) => updateCatalogParams(previous, changes));

  return (
    <div className="catalog-page">
      <div className="catalog-banner"><div className="container"><p>Знайомі міста. Особливі речі.</p><span>Оберіть сувенір зі своєю історією</span></div></div>
      <div className="container catalog-container">
        <nav className="breadcrumbs" aria-label="Хлібні крихти"><Link to="/">Головна</Link><ChevronRight size={13} /><span aria-current="page">Каталог</span></nav>
        <div className="catalog-heading"><div><p className="eyebrow">Частинка міста поруч</p><h1>Каталог сувенірів</h1></div><p>Листівки, кераміка та маленькі спогади.</p></div>
        <button className="button button--outline catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-sidebar" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} />{filtersOpen ? 'Згорнути фільтри' : 'Показати фільтри'}</button>
        <div className="catalog-layout">
          <div className="catalog-sidebar" id="catalog-sidebar" data-open={filtersOpen}><CatalogFilters products={products} filters={filters} onChange={changeFilters} onReset={() => changeFilters({ city: [], category: [], min: null, max: null })} /></div>
          <section className="catalog-results" aria-label="Товари">
            <CatalogToolbar query={query} sort={sort} onSearch={(value) => setParams((previous) => updateCatalogParams(previous, { q: value }), { replace: true })} onSort={(value) => changeFilters({ sort: value })} />
            <p className="catalog-result-count" role="status">Знайдено товарів: {visible.length}</p>
            {visible.length ? <div className="catalog-grid">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> :
              <div className="catalog-empty"><h2>Нічого не знайшли</h2><p>Змініть пошуковий запит, фільтри або діапазон цін.</p><button className="button button--outline" onClick={() => setParams({})}>Показати всі товари <ArrowRight size={16} /></button></div>}
          </section>
        </div>
      </div>
    </div>
  );
}
