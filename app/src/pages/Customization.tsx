import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Product, ProductCustomizationOptions } from '../types/product.types';
import './Customization.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const CATEGORY_LABELS: Record<string, string> = {
  matcha:     'Boissons Matcha',
  bubble_tea: 'Bubble Tea',
  tea:        'Thés',
  mochi:      'Mochi',
};

interface OptionGroup {
  key: string;
  label: string;
  srcKey: keyof ProductCustomizationOptions;
  milkOnly: boolean;
}

const OPTION_GROUPS: OptionGroup[] = [
  { key: 'flavour',        label: 'Parfum',          srcKey: 'flavours',       milkOnly: false },
  { key: 'syrup',          label: 'Sirop',           srcKey: 'syrups',         milkOnly: false },
  { key: 'sweetnessLevel', label: 'Niveau de sucre', srcKey: 'sweetnessLevel', milkOnly: false },
  { key: 'temperature',    label: 'Température',     srcKey: 'temperature',    milkOnly: false },
  { key: 'milkType',       label: 'Type de lait',    srcKey: 'milkType',       milkOnly: true  },
];

export default function Customization() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty,     setQty]     = useState(1);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [adding,  setAdding]  = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((r) => (r.ok ? (r.json() as Promise<Product>) : Promise.reject()))
      .then((p) => {
        setProduct(p);
        // Pre-select the first value for every option group
        const defaults: Record<string, string> = {};
        for (const g of OPTION_GROUPS) {
          if (g.milkOnly && !p.hasMilk) continue;
          const opts = p.customizationOptions[g.srcKey];
          if (opts.length > 0) defaults[g.key] = opts[0];
        }
        setChoices(defaults);
      })
      .catch(() => setError('Produit introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  function select(key: string, value: string) {
    setChoices((c) => ({ ...c, [key]: value }));
  }

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id, quantity: qty, customization: choices }),
      });
      if (!res.ok) {
        setError("Impossible d'ajouter au panier. Veuillez réessayer.");
        return;
      }
      navigate('/cart');
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <main className="custom-page"><p className="custom-page__status">Chargement…</p></main>;
  }
  if (error && !product) {
    return <main className="custom-page"><p className="custom-page__status custom-page__status--error">{error}</p></main>;
  }
  if (!product) return null;

  const lineTotal = (product.price * qty).toFixed(2).replace('.', ',');

  return (
    <main className="custom-page">
      <Link to={`/menu/${id}`} className="custom-page__back">← Retour</Link>

      {/* Product header */}
      <div className="custom-page__header">
        {product.image
          ? <img src={product.image} alt={product.name} className="custom-page__img" />
          : <div className="custom-page__img-placeholder" />
        }
        <div className="custom-page__meta">
          <span className="custom-page__category">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          <h1 className="custom-page__name">{product.name}</h1>
          <p className="custom-page__price">{product.price.toFixed(2).replace('.', ',')} €</p>
        </div>
      </div>

      {/* Customization options */}
      <div className="custom-page__options">
        {OPTION_GROUPS.map((g) => {
          if (g.milkOnly && !product.hasMilk) return null;
          const opts = product.customizationOptions[g.srcKey];
          if (!opts || opts.length === 0) return null;
          return (
            <div key={g.key} className="custom-page__group">
              <h2 className="custom-page__group-label">{g.label}</h2>
              <div className="custom-page__pills">
                {opts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`custom-page__pill${choices[g.key] === val ? ' custom-page__pill--active' : ''}`}
                    onClick={() => select(g.key, val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantity */}
      <div className="custom-page__qty-row">
        <span className="custom-page__qty-label">Quantité</span>
        <div className="custom-page__qty-ctrl">
          <button
            type="button"
            className="custom-page__qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="custom-page__qty-val">{qty}</span>
          <button
            type="button"
            className="custom-page__qty-btn"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            disabled={qty >= 10}
          >
            +
          </button>
        </div>
      </div>

      {error && <p className="custom-page__error" role="alert">{error}</p>}

      <button
        type="button"
        className="custom-page__submit"
        onClick={handleAddToCart}
        disabled={adding}
      >
        {adding ? 'Ajout en cours…' : `Ajouter au panier — ${lineTotal} €`}
      </button>
    </main>
  );
}
