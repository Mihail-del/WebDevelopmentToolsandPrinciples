import { readStorage, writeStorage } from './storage.js';

const ORDERS_KEY = 'souvenir-shop:orders:v1';

function readOrders() {
  const { value, failed } = readStorage(ORDERS_KEY, []);
  return Array.isArray(value) && !failed ? value : null;
}

export function saveOrder(cartItems, cartTotal) {
  const orders = readOrders();
  if (!orders || !cartItems.length) return null;

  // Keep the names and prices from the time of purchase.
  const items = cartItems.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
  }));
  const order = {
    id: globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36),
    date: new Date().toISOString(),
    items,
    total: cartTotal,
  };

  return writeStorage(ORDERS_KEY, [...orders, order]) ? order : null;
}

export function getOrder(id) {
  const order = readOrders()?.find((entry) => entry?.id === id);
  if (!order || !Array.isArray(order.items) || !order.items.length || !Number.isSafeInteger(order.total)) return null;
  if (!Number.isFinite(Date.parse(order.date))) return null;
  if (!order.items.every((item) => item && typeof item.name === 'string' &&
    Number.isSafeInteger(item.price) && Number.isSafeInteger(item.quantity))) return null;
  return order;
}
