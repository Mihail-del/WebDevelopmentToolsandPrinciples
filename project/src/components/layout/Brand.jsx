import { Link } from 'react-router-dom';

export function CityMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 62" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 57h94M8 56V42l8-5 8 5v14M11 44h10M32 56V29h14v27M30 29l9-9 9 9M39 20v-5m-3 0h6M57 56V20h12v36M55 20l8-9 8 9M63 11V5m-3 2h6M78 56V35h15v21M76 35l10-10 9 10M86 25v-6M36 37h6m-6 6h6m-6 6h6M61 29h4m-4 8h4m-4 8h4M83 43h5m-5 6h5M14 56v-8h5v8" />
    </svg>
  );
}

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand ${compact ? 'brand--compact' : ''}`} to="/" aria-label="Сувенірна крамниця — на головну">
      <CityMark /><span>Сувенірна крамниця</span>
    </Link>
  );
}
