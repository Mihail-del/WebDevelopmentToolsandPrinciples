import { useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage.jsx';

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
        <Route path="/dashboard" element={
          <main className="dashboard">
            <p className="eyebrow">YOUR DAILY OUTLOOK</p>
            <h1>Hello, Mykhailo.</h1>
            <p className="muted">Your five-day weather forecast is coming next.</p>
          </main>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer">
        <span>Made for everyday plans.</span>
        <span>Mykhailo Pulov · Lab 06 / React</span>
      </footer>
    </div>
  );
}
