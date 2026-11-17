import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Layout.scss';

export default function Layout() {
  const content = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#about') document.getElementById('about')?.scrollIntoView();
    else content.current?.scrollTo({ top: 0 });
    document.title = 'Сувенірна крамниця';
  }, [location]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">До вмісту</a>
      <Header />
      <main id="main-content" className="site-content" ref={content} tabIndex={-1}><Outlet /></main>
      <Footer />
    </div>
  );
}
