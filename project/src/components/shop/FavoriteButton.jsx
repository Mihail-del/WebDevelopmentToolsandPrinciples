import { Heart } from 'lucide-react';
import { useShop } from '../../context/useShop.js';

export default function FavoriteButton({ product, compact = false }) {
  const { favoriteIds, toggleFavorite } = useShop();
  const selected = favoriteIds.includes(product.id);

  return (
    <button
      type="button"
      className={compact ? 'icon-button product-card__favorite' : 'button button--outline'}
      aria-label={`Обране: ${product.name}`}
      aria-pressed={selected}
      onClick={() => toggleFavorite(product.id)}
    >
      <Heart size={19} fill={selected ? 'currentColor' : 'none'} />
      {!compact && (selected ? 'В обраному' : 'В обране')}
    </button>
  );
}
