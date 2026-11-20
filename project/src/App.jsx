import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CartPage from './pages/CartPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import PlannedPage from './pages/PlannedPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:productId" element={<ProductPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<PlannedPage title="Сторінку не знайдено" notFound />} />
      </Route>
    </Routes>
  );
}
