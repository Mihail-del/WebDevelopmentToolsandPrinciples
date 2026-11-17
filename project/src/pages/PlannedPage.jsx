import { Link } from 'react-router-dom';

export default function PlannedPage({ title, notFound = false }) {
  return (
    <section className="planned-page">
      <p className="eyebrow">{notFound ? '404' : 'Незабаром у крамниці'}</p>
      <h1>{title}</h1>
      <p>{notFound ? 'Такої адреси немає. Поверніться на головну, щоб продовжити.' : 'Цю сторінку додамо на наступному етапі. Поки можна переглянути головну та рекомендовані сувеніри.'}</p>
      <Link className="button" to="/">На головну</Link>
    </section>
  );
}
