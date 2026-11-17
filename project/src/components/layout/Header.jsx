import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import Brand from './Brand.jsx';

const categories = [
  ['Листівки', 'postcards'], ['Чашки', 'mugs'], ['Значки', 'pins'], ['Постери', 'posters'],
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const closeMenus = () => { setMobileOpen(false); setCatalogOpen(false); };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="main-nav" id="main-navigation" aria-label="Основна навігація" data-open={mobileOpen} onKeyDown={(event) => { if (event.key === 'Escape') closeMenus(); }}>
          <NavLink to="/" onClick={closeMenus}>Головна</NavLink>
          <div className="catalog-nav" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setCatalogOpen(false); }}>
            <div className="catalog-nav__trigger">
              <NavLink to="/catalog" onClick={closeMenus}>Каталог</NavLink>
              <button className="submenu-toggle" aria-label="Категорії каталогу" aria-expanded={catalogOpen} aria-controls="catalog-submenu" onClick={() => setCatalogOpen(!catalogOpen)}><ChevronDown size={15} /></button>
            </div>
            <div className="submenu" id="catalog-submenu" hidden={!catalogOpen}>
              <Link to="/catalog" onClick={closeMenus}>Усі сувеніри</Link>
              {categories.map(([label, value]) => <Link key={value} to={`/catalog?category=${value}`} onClick={closeMenus}>{label}</Link>)}
            </div>
          </div>
          <Link to="/#about" onClick={closeMenus}>Про нас</Link>
          <NavLink to="/contacts" onClick={closeMenus}>Контакти</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="icon-button header-search" to="/catalog" aria-label="Пошук сувенірів" onClick={closeMenus}><Search size={21} strokeWidth={1.5} /></Link>
          <Link className="icon-button" to="/favorites" aria-label="Обране" onClick={closeMenus}><Heart size={21} strokeWidth={1.5} /></Link>
          <Link className="icon-button" to="/cart" aria-label="Кошик" onClick={closeMenus}><ShoppingBag size={21} strokeWidth={1.5} /></Link>
          <button className="icon-button mobile-menu-toggle" aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'} aria-expanded={mobileOpen} aria-controls="main-navigation" onClick={() => { setMobileOpen(!mobileOpen); setCatalogOpen(false); }}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
    </header>
  );
}
