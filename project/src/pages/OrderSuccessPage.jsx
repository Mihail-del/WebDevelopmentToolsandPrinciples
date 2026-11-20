import { Link, useLocation, useParams } from 'react-router-dom';
import { getOrder } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <section className="container shop-page">
        <h1>Замовлення не знайдено</h1>
        <div className="shop-empty">
          <p>Демонстраційні замовлення доступні у браузері, де їх оформили.</p>
          <Link className="button" to="/catalog">До каталогу</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container shop-page">
      <h1>Дякуємо за замовлення!</h1>
      <div className="shop-empty">
        <p>Демонстраційне замовлення від {new Date(order.date).toLocaleDateString('uk-UA')} збережено в цьому браузері.</p>
        {state?.cartCleared === false && <p className="shop-notice" role="status">Не вдалося зберегти порожній кошик. Після оновлення сторінки товари можуть з’явитися знову.</p>}
        <div className="shop-summary order-summary">
          <h2>Склад замовлення</h2>
          <ul className="shop-list order-items">
            {order.items.map((item) => (
              <li key={item.productId}><span>{item.name} × {item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></li>
            ))}
          </ul>
          <strong>Разом: {formatPrice(order.total)}</strong>
        </div>
        <Link className="button" to="/catalog">До каталогу</Link>
      </div>
    </section>
  );
}
