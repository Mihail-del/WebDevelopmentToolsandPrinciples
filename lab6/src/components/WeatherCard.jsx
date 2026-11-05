import { describeWeather } from '../services/weather.js';
import WeatherIcon from './WeatherIcon.jsx';

export default function WeatherCard({ day, isToday }) {
  const date = new Date(`${day.date}T12:00:00`);
  const weather = describeWeather(day.code);
  return (
    <article className={`weather-card${isToday ? ' weather-card--today' : ''}`}>
      <div className="weather-card__heading">
        <h3>{isToday ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'long' })}</h3>
        {isToday && <span className="today-dot" aria-hidden="true" />}
      </div>
      <time dateTime={day.date}>{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</time>
      <WeatherIcon type={weather.icon} />
      <p className="weather-card__temperature" aria-label={`High ${Math.round(day.high)} degrees Celsius, low ${Math.round(day.low)} degrees Celsius`}>
        {Math.round(day.high)}°<span> / {Math.round(day.low)}°</span>
      </p>
      <p className="weather-card__condition">{weather.label}</p>
      <dl className="weather-card__details">
        <div><dt>Rain</dt><dd>{Number.isFinite(day.rain) ? `${day.rain}%` : '—'}</dd></div>
        <div><dt>Wind</dt><dd>{Number.isFinite(day.wind) ? `${Math.round(day.wind)} km/h` : '—'}</dd></div>
      </dl>
    </article>
  );
}
