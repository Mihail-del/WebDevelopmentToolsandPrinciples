import { useEffect, useState } from 'react';
import WeatherCard from '../components/WeatherCard.jsx';
import { fetchForecast, KYIV } from '../services/weather.js';

export default function Dashboard() {
  const [location] = useState(KYIV);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);

    async function loadForecast() {
      setIsLoading(true);
      setError('');
      setForecast([]);
      try {
        const days = await fetchForecast(location, controller.signal);
        if (active) {
          setForecast(days);
          setUpdatedAt(new Date());
        }
      } catch {
        if (active) setError('We could not load the forecast. Check your connection and try again.');
      } finally {
        clearTimeout(timeout);
        if (active) setIsLoading(false);
      }
    }

    loadForecast();
    // Cancel the previous request when leaving the page or loading another place.
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [location, retry]);

  return (
    <main className="dashboard">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">YOUR DAILY OUTLOOK</p>
          <h1>Your next five days.</h1>
          <p className="muted">A glance at the sky. A little more certainty.</p>
        </div>
      </div>
      <section className="forecast-section" aria-labelledby="forecast-title" aria-busy={isLoading}>
        <div className="forecast-toolbar">
          <div>
            <h2 id="forecast-title">{location.name}</h2>
            <p className="muted">5-day forecast <span aria-hidden="true">·</span> Temperatures in °C</p>
          </div>
          <span className="forecast-label">THE WEEK AHEAD <span aria-hidden="true">↗</span></span>
        </div>
        {isLoading && <div className="forecast-state" role="status"><span className="spinner" aria-hidden="true" /><p>Looking at the sky…</p><p className="muted">Loading your five-day forecast.</p></div>}
        {error && <div className="forecast-state"><p className="form-error" role="alert">{error}</p><button className="button" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}
        {!isLoading && !error && <div className="forecast-grid">
          {forecast.map((day, index) => <WeatherCard key={day.date} day={day} isToday={index === 0} />)}
        </div>}
        <div className="forecast-footnote">
          <span>{!isLoading && !error && updatedAt ? `Updated at ${updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'A fresh forecast for your everyday plans.'}</span>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather data by Open-Meteo ↗</a>
        </div>
      </section>
      <aside className="forecast-note"><span aria-hidden="true">☀</span><p>A forecast is a little head start.<br /><span className="muted">The rest of the day is yours.</span></p></aside>
    </main>
  );
}
