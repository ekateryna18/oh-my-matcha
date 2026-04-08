import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types/product.types';
import './ProductDetail.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const CATEGORY_LABELS: Record<string, string> = {
  matcha:     'Boissons Matcha',
  bubble_tea: 'Bubble Tea',
  mochi:      'Mochi',
  tea:        'Thés',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Produit introuvable.');
        return res.json() as Promise<Product>;
      })
      .then(setProduct)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="product-detail__status">Chargement...</p>;
  if (error || !product) return (
    <div className="product-detail__status">
      <p>{error ?? 'Produit introuvable.'}</p>
      <Link to="/menu" className="product-detail__back">← Retour au menu</Link>
    </div>
  );

  const orderTarget = `/menu/${product._id}/customize`;

  return (
    <div className="product-detail">

      {/* ── Back link ── */}
      <Link to="/menu" className="product-detail__back">← Menu</Link>

      {/* ── Image ── */}
      <div className="product-detail__img-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-detail__img"
          />
        ) : (
          <div className="product-detail__img product-detail__img-ph" />
        )}
      </div>

      {/* ── Info ── */}
      <div className="product-detail__body">
        <span className="product-detail__category">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>

        <h1 className="product-detail__name">{product.name}</h1>

        <p className="product-detail__desc">{product.description}</p>

        {product.allergens.length > 0 && (
          <p className="product-detail__allergens">
            Allergènes : {product.allergens.join(', ')}
          </p>
        )}

        <div className="product-detail__footer">
          <span className="product-detail__price">
            {product.price.toFixed(2).replace('.', ',')} €
          </span>

          <Link
            to={user ? orderTarget : '/login'}
            state={user ? undefined : { from: orderTarget }}
            className="product-detail__btn"
          >
            Commander
          </Link>
        </div>
      </div>

    </div>
  );
}
