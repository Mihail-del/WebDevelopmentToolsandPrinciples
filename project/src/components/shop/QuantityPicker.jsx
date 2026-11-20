import { Minus, Plus } from 'lucide-react';

export default function QuantityPicker({ value, max, onChange, label = 'Кількість' }) {
  return (
    <div className="quantity-picker" role="group" aria-label={label}>
      <button type="button" aria-label="Зменшити кількість" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus size={16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label="Збільшити кількість" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus size={16} />
      </button>
    </div>
  );
}
