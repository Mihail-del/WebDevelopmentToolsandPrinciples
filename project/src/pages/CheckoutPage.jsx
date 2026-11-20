import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/useShop.js';
import { saveOrder } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useShop();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function placeOrder(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const phone = fields.get('phone').trim();
    const digits = phone.replace(/\D/g, '');

    if (!fields.get('name').trim() || !fields.get('address').trim()) {
      setError('Введіть ім’я та адресу доставки.');
      return;
    }
    if (digits.length < 10 || digits.length > 15 || /[^\d+()\s-]/.test(phone)) {
      setError('Введіть коректний номер телефону.');
      return;
    }

    const order = saveOrder(cartItems, cartTotal);
    if (!order) {
      setError('Не вдалося зберегти замовлення в браузері. Перевірте налаштування сховища і спробуйте ще раз.');
      return;
    }

    const cartCleared = clearCart();
    navigate(`/order-success/${order.id}`, { replace: true, state: { cartCleared } });
  }

  return (
    <section className="container shop-page">
      <h1>Оформлення замовлення</h1>
      {cartItems.length ? (
        <div className="shop-columns">
          <form className="checkout-form" onSubmit={placeOrder}>
            <p>Це демонстраційне замовлення. Можна ввести вигадані дані.</p>
            <label>Ім’я та прізвище<input name="name" autoComplete="name" required /></label>
            <label>Телефон<input name="phone" type="tel" autoComplete="tel" required /></label>
            <label>Електронна пошта<input name="email" type="email" autoComplete="email" required /></label>
            <label>Місто та адреса доставки<input name="address" autoComplete="street-address" required /></label>
            {error && <p className="shop-notice" role="alert">{error}</p>}
            <div className="checkout-form__actions">
              <button type="submit" className="button">Підтвердити замовлення</button>
              <Link className="text-link" to="/cart">До кошика</Link>
            </div>
          </form>
          <aside className="shop-summary">
            <h2>Ваше замовлення</h2>
            <ul className="shop-list order-items">
              {cartItems.map(({ product, quantity }) => (
                <li key={product.id}><span>{product.name} × {quantity}</span><strong>{formatPrice(product.price * quantity)}</strong></li>
              ))}
            </ul>
            <strong>Разом: {formatPrice(cartTotal)}</strong>
          </aside>
        </div>
      ) : (
        <div className="shop-empty">
          <p>Додайте сувеніри в кошик, щоб оформити замовлення.</p>
          <Link className="button" to="/catalog">До каталогу</Link>
        </div>
      )}
    </section>
  );
}
