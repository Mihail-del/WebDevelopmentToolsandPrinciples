import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useShop } from '../../context/useShop.js';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.scss';

export default function Layout() {
  const { favoritesFailed } = useShop();
  const content = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#about') document.getElementById('about')?.scrollIntoView();
    else content.current?.scrollTo({ top: 0 });
    document.title = 'Сувенірна крамниця';
  }, [location.pathname, location.hash]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">До вмісту</a>
      <Header />
      <main id="main-content" className="site-content" ref={content} tabIndex={-1}>
        {favoritesFailed && <p className="container shop-notice" role="status">Обране не вдалося завантажити або зберегти повністю.</p>}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
