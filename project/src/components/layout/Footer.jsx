import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Brand from './Brand.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Brand compact />
        <p>З любов’ю до українських міст</p>
        <Link className="text-link" to="/contacts">Контакти <ArrowUpRight size={15} /></Link>
        <span className="demo-note">Навчальний проєкт</span>
      </div>
    </footer>
  );
}
