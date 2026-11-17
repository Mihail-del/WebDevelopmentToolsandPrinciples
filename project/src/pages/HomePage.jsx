import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Image, Mail, Pin } from 'lucide-react';
import { CityMark } from '../components/layout/Brand.jsx';
import HeroSlider from '../components/home/HeroSlider.jsx';
import ProductCard from '../components/catalog/ProductCard.jsx';
import products from '../data/products.json';
import './HomePage.scss';

const categories = [
  { id: 'postcards', name: 'Листівки', detail: 'Кілька теплих слів', icon: Mail },
  { id: 'mugs', name: 'Чашки', detail: 'Для повільних ранків', icon: Coffee },
  { id: 'pins', name: 'Значки', detail: 'Місто завжди поруч', icon: Pin },
  { id: 'posters', name: 'Постери', detail: 'Спогади на стіні', icon: Image },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <section className="container category-strip" aria-label="Категорії сувенірів">
        {categories.map(({ id, name, detail, icon: Icon }) => (
          <Link className="category-link" to={`/catalog?category=${id}`} key={id}>
            <Icon size={29} strokeWidth={1.15} /><span><span className="category-link__name">{name}</span><span className="category-link__detail">{detail}</span></span><ArrowRight size={17} strokeWidth={1.3} />
          </Link>
        ))}
      </section>
      <section className="container featured-section" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div><p className="eyebrow">Знайдіть свій спогад</p><h2 id="featured-heading">Рекомендована колекція</h2></div>
          <Link className="text-link" to="/catalog">Усі сувеніри <ArrowRight size={17} /></Link>
        </div>
        <div className="product-grid">{products.filter((product) => product.featured).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <section className="container about-section" id="about" aria-labelledby="about-heading">
        <div className="about-illustration"><CityMark /><span>З близьких серцю місць</span></div>
        <div className="about-copy"><p className="eyebrow">Про крамницю</p><h2 id="about-heading">Міста, які хочеться<br />забрати з собою.</h2><p>Листівка зі знайомою вулицею. Чашка з улюбленим краєвидом. Маленький подарунок для тих, за ким сумуєш. Ми зібрали сувеніри, які бережуть спогади про українські міста.</p><Link className="text-link" to="/catalog">Знайти щось своє <ArrowRight size={17} /></Link></div>
      </section>
    </>
  );
}
