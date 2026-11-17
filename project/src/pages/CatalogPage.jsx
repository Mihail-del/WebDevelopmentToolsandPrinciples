import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import products from '../data/products.json';
import ProductCard from '../components/catalog/ProductCard.jsx';
import CatalogFilters from '../components/catalog/CatalogFilters.jsx';
import { filterProducts, readCatalogFilters, updateCatalogParams } from '../utils/catalog.js';
import './CatalogPage.scss';

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = readCatalogFilters(params, products);
  const visible = filterProducts(products, filters);
  const changeFilters = (changes) => setParams((previous) => updateCatalogParams(previous, changes));

  return (
    <div className="catalog-page">
      <div className="catalog-banner"><div className="container"><p>Знайомі міста. Особливі речі.</p><span>Оберіть сувенір зі своєю історією</span></div></div>
      <div className="container catalog-container">
        <nav className="breadcrumbs" aria-label="Хлібні крихти"><Link to="/">Головна</Link><ChevronRight size={13} /><span aria-current="page">Каталог</span></nav>
        <div className="catalog-heading"><div><p className="eyebrow">Частинка міста поруч</p><h1>Каталог сувенірів</h1></div><p>Листівки, кераміка та маленькі спогади.</p></div>
        <button className="button button--outline catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-sidebar" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} />{filtersOpen ? 'Згорнути фільтри' : 'Показати фільтри'}</button>
        <div className="catalog-layout">
          <div className="catalog-sidebar" id="catalog-sidebar" data-open={filtersOpen}><CatalogFilters products={products} filters={filters} onChange={changeFilters} onReset={() => setParams({})} /></div>
          <section className="catalog-results" aria-label="Товари">
            <p className="catalog-result-count" role="status">Знайдено товарів: {visible.length}</p>
            {visible.length ? <div className="catalog-grid">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> :
              <div className="catalog-empty"><h2>Нічого не знайшли</h2><p>Спробуйте інше місто, категорію або ширший діапазон цін.</p><button className="button button--outline" onClick={() => setParams({})}>Показати всі товари <ArrowRight size={16} /></button></div>}
          </section>
        </div>
      </div>
    </div>
  );
}
