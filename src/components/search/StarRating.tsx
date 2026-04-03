import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <Rating value={rating} readOnly style={{ maxWidth: 90 }} />
      <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}
