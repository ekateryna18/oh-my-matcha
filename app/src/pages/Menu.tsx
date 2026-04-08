import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product.types';
import './Menu.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const CATEGORIES = [
  { value: 'matcha',     label: 'Matcha' },
  { value: 'bubble_tea', label: 'Bubble Tea' },
  { value: 'mochi',      label: 'Mochi' },
] as const;

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Impossible de charger les produits.');
        return res.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = (cat: string) => products.filter((p) => p.category === cat);

  return (
    <div className="menu-page">
      <h1 className="menu-page__title">Commander</h1>

      {/* ── Product grid ── */}
      {loading && <p className="menu-page__status">Chargement...</p>}
      {error   && <p className="menu-page__status menu-page__status--error">{error}</p>}

      {!loading && !error && (
        <div className="menu-page__grid">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/menu/${product._id}`}
              className="menu-page__item"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="menu-page__item-img"
                />
              ) : (
                <div className="menu-page__item-img menu-page__item-ph" />
              )}
              <span className="menu-page__item-name">{product.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Category sections ── */}
      {!loading && !error && CATEGORIES.map((cat) => {
        const first = byCategory(cat.value)[0];
        return (
          <div key={cat.value} className="menu-page__cat">
            <hr className="menu-page__cat-line" />
            <div className="menu-page__cat-inner">
              <h2 className="menu-page__cat-name">{cat.label}</h2>
              {first && (
                <Link to={`/menu/${first._id}`} className="menu-page__cat-img-wrap">
                  {first.image ? (
                    <img
                      src={first.image}
                      alt={cat.label}
                      className="menu-page__cat-img"
                    />
                  ) : (
                    <div className="menu-page__cat-img menu-page__item-ph" />
                  )}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Tagline ── */}
      {!loading && !error && (
        <p className="menu-page__tagline">
          Évite la queue !<br />
          Commande tes boissons préférées en 3 clics<br />
          et récupère-les à l'heure de ton choix
        </p>
      )}
    </div>
  );
}
