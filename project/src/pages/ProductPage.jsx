import { Link, useParams } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import products from '../data/products.json';
import { formatPrice } from '../utils/formatPrice.js';
import './ProductPage.scss';

export default function ProductPage() {
  const { productId } = useParams();
  const product = products.find(({ id }) => id === productId);

  if (!product) {
    return (
      <section className="planned-page">
        <h1>Товар не знайдено</h1>
        <p>Перегляньте інші сувеніри в каталозі.</p>
        <Link className="button" to="/catalog">До каталогу</Link>
      </section>
    );
  }

  return (
    <section className="container shop-page">
      <nav className="breadcrumbs" aria-label="Хлібні крихти">
        <Link to="/">Головна</Link>
        <ChevronRight size={13} />
        <Link to="/catalog">Каталог</Link>
        <ChevronRight size={13} />
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="product-detail">
        <div className="product-detail__photos">
          {product.images.map((image) => (
            <img key={image} src={image} alt={product.name} width="300" height="300" />
          ))}
        </div>
        <div className="product-detail__info">
          <p className="text-link"><MapPin size={15} />{product.city}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p>{product.stock > 0 ? `У наявності: ${product.stock} шт.` : 'Немає в наявності'}</p>
        </div>
      </div>
    </section>
  );
}
