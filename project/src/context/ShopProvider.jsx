import { useState } from 'react';
import products from '../data/products.json';
import { readStorage, writeStorage } from '../services/storage.js';
import { ShopContext } from './useShop.js';

const CART_KEY = 'souvenir-shop:cart:v1';
const FAVORITES_KEY = 'souvenir-shop:favorites:v1';

function loadCart() {
  const { value, failed } = readStorage(CART_KEY, []);
  if (!Array.isArray(value)) return { items: [], failed: true };

  const items = [];
  for (const row of value) {
    const product = products.find(({ id }) => id === row?.productId);
    if (!product || product.stock < 1 || !Number.isInteger(row.quantity) || row.quantity < 1) continue;
    if (items.some(({ productId }) => productId === product.id)) continue;
    items.push({ productId: product.id, quantity: Math.min(row.quantity, product.stock) });
  }

  return { items, failed: failed || items.length !== value.length };
}

function loadFavorites() {
  const { value, failed } = readStorage(FAVORITES_KEY, []);
  if (!Array.isArray(value)) return { ids: [], failed: true };

  const ids = [...new Set(value.filter((savedId) => products.some(({ id }) => id === savedId)))];
  return { ids, failed: failed || ids.length !== value.length };
}

export default function ShopProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [favorites, setFavorites] = useState(loadFavorites);

  // Get current names and prices from the catalog.
  const cartItems = cart.items.map(({ productId, quantity }) => ({
    product: products.find(({ id }) => id === productId),
    quantity,
  }));
  const cartTotal = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const cartCount = cartItems.reduce((sum, { quantity }) => sum + quantity, 0);

  function saveCart(items) {
    const saved = writeStorage(CART_KEY, items);
    setCart({ items, failed: !saved });
    return saved;
  }

  function setCartQuantity(product, quantity) {
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > product.stock) return;
    const exists = cart.items.some(({ productId }) => productId === product.id);
    if (quantity === 0) {
      saveCart(cart.items.filter(({ productId }) => productId !== product.id));
    } else if (exists) {
      saveCart(cart.items.map((item) => item.productId === product.id ? { ...item, quantity } : item));
    } else {
      saveCart([...cart.items, { productId: product.id, quantity }]);
    }
  }

  function addToCart(product, quantity) {
    const current = cart.items.find(({ productId }) => productId === product.id)?.quantity ?? 0;
    setCartQuantity(product, current + quantity);
  }

  function toggleFavorite(id) {
    const ids = favorites.ids.includes(id)
      ? favorites.ids.filter((favoriteId) => favoriteId !== id)
      : [...favorites.ids, id];
    setFavorites({ ids, failed: !writeStorage(FAVORITES_KEY, ids) });
  }

  return (
    <ShopContext.Provider value={{
      cartItems, cartTotal, cartCount, cartFailed: cart.failed, setCartQuantity, addToCart, clearCart: () => saveCart([]),
      favoriteIds: favorites.ids, favoritesFailed: favorites.failed, toggleFavorite,
    }}>
      {children}
    </ShopContext.Provider>
  );
}
