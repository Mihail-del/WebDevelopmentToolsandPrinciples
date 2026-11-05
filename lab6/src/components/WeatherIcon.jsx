export default function WeatherIcon({ type }) {
  const hasSun = type === 'sun' || type === 'partly-cloudy';
  return (
    <svg className="weather-icon" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {hasSun && <g stroke="#ca923e" strokeWidth="3" strokeLinecap="round">
        <circle cx="44" cy="39" r="18" fill="#efc578" stroke="none" />
        <path d="M44 10v-5m0 68v-5M15 39h-5m68 0h-5M23 18l-4-4m50 50-4-4M23 60l-4 4m50-50-4 4" />
      </g>}
      {type !== 'sun' && <path d="M27 67a15 15 0 0 1-1-30 22 22 0 0 1 42-4 17 17 0 1 1 6 34Z" fill="#cedee4" stroke="#7d9aa8" strokeWidth="2" />}
      {type === 'rain' && <path d="m34 76-4 8m23-8-4 8m23-8-4 8" stroke="#699dbb" strokeWidth="4" strokeLinecap="round" />}
      {type === 'snow' && <g fill="#699dbb"><circle cx="31" cy="80" r="3" /><circle cx="51" cy="85" r="3" /><circle cx="71" cy="80" r="3" /></g>}
      {type === 'storm' && <path d="m52 62-12 18h12l-5 14 20-22H54l7-10Z" fill="#d3a14a" />}
      {type === 'fog' && <path d="M22 77h57M30 86h42" stroke="#7d9aa8" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}
