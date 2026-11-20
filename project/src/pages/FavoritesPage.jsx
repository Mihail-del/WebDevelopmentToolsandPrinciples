import { Link } from 'react-router-dom';
import ProductCard from '../components/catalog/ProductCard.jsx';
import { useShop } from '../context/useShop.js';
import products from '../data/products.json';

export default function FavoritesPage() {
  const { favoriteIds } = useShop();
  const favorites = products.filter(({ id }) => favoriteIds.includes(id));

  return (
    <section className="container shop-page">
      <h1>Обране</h1>
      {favorites.length ? (
        <div className="catalog-grid">
          {favorites.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="shop-empty">
          <p>Тут з’являться сувеніри, які ви додасте в обране.</p>
          <Link className="button" to="/catalog">До каталогу</Link>
        </div>
      )}
    </section>
  );
}
