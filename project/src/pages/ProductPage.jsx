import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, MapPin, ShoppingBag } from 'lucide-react';
import QuantityPicker from '../components/shop/QuantityPicker.jsx';
import { useShop } from '../context/useShop.js';
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

  return <ProductDetails key={product.id} product={product} />;
}

function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { cartItems, addToCart, cartFailed } = useShop();
  const inCart = cartItems.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const available = product.stock - inCart;
  const selected = Math.min(quantity, available);

  function handleAdd() {
    addToCart(product, selected);
    setQuantity(1);
    setAdded(true);
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
          {available > 0 && <QuantityPicker value={selected} max={available} onChange={setQuantity} />}
          <div className="product-detail__actions">
            <button type="button" className="button" disabled={available === 0} onClick={handleAdd}>
              <ShoppingBag size={18} />У кошик
            </button>
          </div>
          {inCart > 0 && <Link className="text-link" to="/cart">У кошику: {inCart} шт. · Перейти</Link>}
          {added && <p role="status">{cartFailed ? 'Додано, але зміни не вдалося зберегти в браузері.' : 'Товар додано в кошик.'}</p>}
        </div>
      </div>
    </section>
  );
}
