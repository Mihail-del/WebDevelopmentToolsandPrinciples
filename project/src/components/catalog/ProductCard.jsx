import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';
import FavoriteButton from '../shop/FavoriteButton.jsx';
import './ProductCard.scss';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link className="product-card__image" to={`/catalog/${product.id}`} aria-label={`Переглянути: ${product.name}`}>
        <img src={product.images[0]} alt={product.name} width="300" height="300" loading="lazy" decoding="async" />
        <span className="product-card__view"><ArrowUpRight size={19} strokeWidth={1.5} /></span>
      </Link>
      <FavoriteButton product={product} compact />
      <p className="product-card__city"><MapPin size={12} />{product.city}</p>
      <h3><Link to={`/catalog/${product.id}`}>{product.name}</Link></h3>
      <p className="product-card__price">{formatPrice(product.price)}</p>
    </article>
  );
}
