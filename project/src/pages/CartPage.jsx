import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import QuantityPicker from '../components/shop/QuantityPicker.jsx';
import { useShop } from '../context/useShop.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function CartPage() {
  const { cartItems, cartTotal, cartFailed, setCartQuantity } = useShop();

  return (
    <section className="container shop-page">
      <h1>Кошик</h1>
      {cartFailed && <p className="shop-notice" role="status">Кошик не вдалося завантажити або зберегти повністю.</p>}
      {cartItems.length === 0 ? (
        <div className="shop-empty">
          <p>У кошику поки немає товарів.</p>
          <Link className="button" to="/catalog">До каталогу</Link>
        </div>
      ) : (
        <div className="shop-columns">
          <ul className="shop-list">
            {cartItems.map(({ product, quantity }) => (
              <li className="cart-row" key={product.id}>
                <Link to={`/catalog/${product.id}`} aria-label={product.name}>
                  <img src={product.images[0]} alt="" width="76" height="76" />
                </Link>
                <div>
                  <h2><Link to={`/catalog/${product.id}`}>{product.name}</Link></h2>
                  <p>{formatPrice(product.price)} / шт.</p>
                </div>
                <div className="cart-row__controls">
                  <QuantityPicker value={quantity} max={product.stock} label={`Кількість: ${product.name}`} onChange={(next) => setCartQuantity(product, next)} />
                  <strong>{formatPrice(product.price * quantity)}</strong>
                  <button type="button" className="icon-button" aria-label={`Видалити: ${product.name}`} onClick={() => setCartQuantity(product, 0)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="shop-summary">
            <h2>Разом</h2>
            <strong>{formatPrice(cartTotal)}</strong>
            <Link className="button" to="/checkout">Оформити замовлення</Link>
            <Link className="text-link" to="/catalog">Продовжити покупки</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
