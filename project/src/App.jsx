import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import PlannedPage from './pages/PlannedPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<PlannedPage title="Каталог" />} />
        <Route path="/catalog/:productId" element={<PlannedPage title="Сторінка товару" />} />
        <Route path="/favorites" element={<PlannedPage title="Обране" />} />
        <Route path="/cart" element={<PlannedPage title="Кошик" />} />
        <Route path="/checkout" element={<PlannedPage title="Оформлення замовлення" />} />
        <Route path="/order-success/:orderId" element={<PlannedPage title="Замовлення" />} />
        <Route path="/contacts" element={<PlannedPage title="Контакти" />} />
        <Route path="*" element={<PlannedPage title="Сторінку не знайдено" notFound />} />
      </Route>
    </Routes>
  );
}
