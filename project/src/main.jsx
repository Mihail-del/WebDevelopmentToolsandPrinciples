import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ShopProvider from './context/ShopProvider.jsx';
import './styles/main.scss';
import './styles/responsive.scss';
import './styles/shop.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><ShopProvider><App /></ShopProvider></BrowserRouter></React.StrictMode>,
);
