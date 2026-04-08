import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types/product.types';
import './ProductCard.css';

const CATEGORY_LABELS: Record<string, string> = {
  matcha: 'Boissons Matcha',
  bubble_tea: 'Bubble Tea',
  tea: 'Thés',
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { user } = useAuth();
  const target = `/menu/${product._id}/customize`;

  return (
    <article className="product-card">
      <div className="product-card__img-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__img"
          />
        ) : (
          <div className="product-card__img-ph" aria-hidden="true" />
        )}
      </div>

      <div className="product-card__body">
        <span className="product-card__category">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>

        <h3 className="product-card__name">{product.name}</h3>

        <p className="product-card__desc">{product.description}</p>

        {product.allergens.length > 0 && (
          <p className="product-card__allergens">
            Allergènes : {product.allergens.join(', ')}
          </p>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">
            {product.price.toFixed(2).replace('.', ',')} €
          </span>
          <Link
            to={user ? target : '/login'}
            state={user ? undefined : { from: target }}
            className="product-card__btn"
          >
            Commander
          </Link>
        </div>
      </div>
    </article>
  );
}
