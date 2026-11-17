import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pageCount, params }) {
  const pageLink = (number) => {
    const next = new URLSearchParams(params);
    if (number === 1) next.delete('page');
    else next.set('page', String(number));
    return { pathname: '/catalog', search: next.toString() };
  };
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label="Сторінки каталогу">
      {page > 1 ? <Link to={pageLink(page - 1)} aria-label="Попередня сторінка"><ChevronLeft size={17} /></Link> : <span aria-disabled="true" aria-label="Попередня сторінка"><ChevronLeft size={17} /></span>}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) =>
        <Link key={number} to={pageLink(number)} aria-label={`Сторінка ${number}`} aria-current={number === page ? 'page' : undefined}>{number}</Link>)}
      {page < pageCount ? <Link to={pageLink(page + 1)} aria-label="Наступна сторінка"><ChevronRight size={17} /></Link> : <span aria-disabled="true" aria-label="Наступна сторінка"><ChevronRight size={17} /></span>}
    </nav>
  );
}
