import { useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">☀ <span>weather<span className="brand-dot">.</span></span></Link>
        <span className="header-note">A little forecast. A clearer day.</span>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={isAuthenticated
          ? <Navigate to="/dashboard" replace />
          : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer">
        <span>Made for everyday plans.</span>
        <span>Mykhailo Pulov · Lab 06 / React</span>
      </footer>
    </div>
  );
}
