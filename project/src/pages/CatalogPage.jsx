import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import products from '../data/products.json';
import ProductCard from '../components/catalog/ProductCard.jsx';
import CatalogFilters from '../components/catalog/CatalogFilters.jsx';
import CatalogToolbar from '../components/catalog/CatalogToolbar.jsx';
import Pagination from '../components/catalog/Pagination.jsx';
import { filterProducts, readCatalogFilters, updateCatalogParams, searchProducts, sortProducts, SORT_OPTIONS, paginateProducts } from '../utils/catalog.js';
import './CatalogPage.scss';

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = readCatalogFilters(params, products);
  const query = params.get('q') ?? '';
  const sort = Object.hasOwn(SORT_OPTIONS, params.get('sort')) ? params.get('sort') : 'recommended';
  const visible = sortProducts(searchProducts(filterProducts(products, filters), query), sort);
  const { page, pageCount, items, start } = paginateProducts(visible, params.get('page'));
  const count = useRef(null);
  const previousPage = useRef(page);

  useEffect(() => {
    if (params.has('page') && params.get('page') !== String(page)) {
      setParams((previous) => {
        const next = new URLSearchParams(previous);
        if (page === 1) next.delete('page');
        else next.set('page', String(page));
        return next;
      }, { replace: true });
    }
  }, [params, page, setParams]);

  useEffect(() => {
    if (previousPage.current !== page) {
      count.current?.scrollIntoView({ block: 'start' });
      count.current?.focus({ preventScroll: true });
    }
    previousPage.current = page;
  }, [page]);

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
            <p className="catalog-result-count" role="status" ref={count} tabIndex={-1}>Знайдено товарів: {visible.length}</p>
            {visible.length ? <div className="catalog-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div> :
              <div className="catalog-empty"><h2>Нічого не знайшли</h2><p>Змініть пошуковий запит, фільтри або діапазон цін.</p><button className="button button--outline" onClick={() => setParams({})}>Показати всі товари <ArrowRight size={16} /></button></div>}
            {visible.length > 0 && <div className="catalog-pagination-row"><p className="catalog-result-range">Показано {start + 1}–{start + items.length} із {visible.length}</p><Pagination page={page} pageCount={pageCount} params={params} /></div>}
          </section>
        </div>
      </div>
    </div>
  );
}
