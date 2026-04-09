import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConsents, getCookie, setCookie } from '../lib/ConsentManager';
import type { Cart, CartItem, Slot } from '../types/cart.types';
import type { Product } from '../types/product.types';
import './Cart.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';
const SLOT_PREF_COOKIE = 'pickup_slot_pref';

const CUSTOM_LABELS: Record<string, string> = {
  flavour:        'Parfum',
  syrup:          'Sirop',
  sweetnessLevel: 'Sucre',
  temperature:    'Temp.',
  milkType:       'Lait',
};

/** Keep only slots whose start time is strictly after now */
function filterFutureSlots(slots: Slot[]): Slot[] {
  const now = new Date();
  return slots.filter((s) => {
    const [h, m] = s.time.split(':').map(Number);
    const slotDate = new Date();
    slotDate.setHours(h, m, 0, 0);
    return slotDate > now;
  });
}

/** Convert "12:00" → "12:00 - 12:15" */
function slotRange(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const endTotalMin = h * 60 + m + 15;
  const endH = Math.floor(endTotalMin / 60).toString().padStart(2, '0');
  const endM = (endTotalMin % 60).toString().padStart(2, '0');
  return `${time} - ${endH}:${endM}`;
}

/** Merge cart item with product data */
interface EnrichedItem extends CartItem {
  name: string;
  image?: string;
}

export default function CartPage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [cart,         setCart]         = useState<Cart | null>(null);
  const [products,     setProducts]     = useState<Product[]>([]);
  const [slots,        setSlots]        = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [applyCredit,  setApplyCredit]  = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [removing,     setRemoving]     = useState<string | null>(null);
  const [slotOpen,     setSlotOpen]     = useState(false);

  async function fetchCart(): Promise<Cart> {
    const res = await fetch(`${API_URL}/cart`, { credentials: 'include' });
    const data = await res.json() as Cart;
    setCart(data);
    return data;
  }

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/cart`,     { credentials: 'include' }).then((r) => r.json() as Promise<Cart>),
      fetch(`${API_URL}/slots`,    { credentials: 'include' }).then((r) => r.json() as Promise<Slot[]>),
      fetch(`${API_URL}/products`).then((r) => r.json() as Promise<Product[]>),
    ])
      .then(([cartData, slotsData, productsData]) => {
        const futureSlots = filterFutureSlots(slotsData);
        setCart(cartData);
        setSlots(futureSlots);
        setProducts(productsData);

        // Pre-fill preferred slot from cookie if it's still in the future
        const consents = getConsents();
        const pref = consents?.functional ? getCookie(SLOT_PREF_COOKIE) : null;
        if (pref && futureSlots.some((s) => s.time === pref)) {
          setSelectedSlot(pref);
        } else if (futureSlots.length > 0) {
          setSelectedSlot(futureSlots[0].time);
        }
      })
      .catch(() => setError('Impossible de charger le panier.'))
      .finally(() => setLoading(false));
  }, []);

  function handleSlotChange(time: string) {
    setSelectedSlot(time);
    setSlotOpen(false);
    if (getConsents()?.functional) {
      setCookie(SLOT_PREF_COOKIE, time, 14);
    }
  }

  async function handleRemove(itemId: string) {
    setRemoving(itemId);
    try {
      await fetch(`${API_URL}/cart/${itemId}`, { method: 'DELETE', credentials: 'include' });
      await fetchCart();
    } finally {
      setRemoving(null);
    }
  }

  // Enrich cart items with product name + image
  const enriched: EnrichedItem[] = (cart?.items ?? []).map((item) => {
    const product = products.find((p) => p._id === item.productId.toString());
    return { ...item, name: product?.name ?? '—', image: product?.image };
  });

  const pts           = user?.loyaltyPoints ?? 0;
  const totalAmount   = cart?.totalAmount ?? 0;
  const creditApplied = applyCredit && pts >= 50 ? 5 : 0;
  const finalAmount   = Math.max(0, totalAmount - creditApplied);

  function handleProceed() {
    if (!selectedSlot) return;
    navigate('/payment', { state: { pickupSlot: selectedSlot, applyCredit, totalAmount, creditApplied, finalAmount } });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <main className="cart-page"><p className="cart-page__status">Chargement…</p></main>;
  if (error)   return <main className="cart-page"><p className="cart-page__status cart-page__status--error">{error}</p></main>;

  const isEmpty = enriched.length === 0;

  return (
    <main className="cart-page">

      {/* ── Hero ── */}
      <div className="cart-page__hero">
        <h1 className="cart-page__title">PANIER</h1>
        <p className="cart-page__tagline">
          Commande maintenant, récupère au salon dans 15 minutes.
        </p>
      </div>

      {isEmpty ? (
        <div className="cart-page__empty">
          <p>Votre panier est vide.</p>
          <Link to="/menu" className="cart-page__link">Voir le menu →</Link>
        </div>
      ) : (
        <>
          {/* ── Item list ── */}
          <ul className="cart-list">
            {enriched.map((item) => {
              const customLines = Object.entries(item.customization)
                .filter(([, v]) => v)
                .map(([k, v]) => `${CUSTOM_LABELS[k] ?? k} : ${v}`)
                .join(' · ');

              return (
                <li key={item._id} className="cart-item">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="cart-item__img" />
                    : <div className="cart-item__img-placeholder" />
                  }
                  <div className="cart-item__body">
                    <div className="cart-item__head">
                      <span className="cart-item__name">{item.name}</span>
                      <span className="cart-item__price">
                        {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                    {customLines && <p className="cart-item__custom">{customLines}</p>}
                    <div className="cart-item__foot">
                      <span className="cart-item__qty">Qté : {item.quantity}</span>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => handleRemove(item._id)}
                        disabled={removing === item._id}
                      >
                        {removing === item._id ? '…' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ── Slot picker ── */}
          <div className="cart-page__slot-section">
            <p className="cart-page__slot-label">Créneau de retrait</p>

            {slots.length === 0 ? (
              <p className="cart-page__status">Aucun créneau disponible aujourd'hui.</p>
            ) : slotOpen ? (
              /* Expanded list */
              <div className="cart-page__slot-dropdown">
                <div className="cart-page__slot-grid">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      type="button"
                      className={`cart-page__slot-pill${selectedSlot === slot.time ? ' cart-page__slot-pill--active' : ''}`}
                      onClick={() => handleSlotChange(slot.time)}
                    >
                      {slotRange(slot.time)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Collapsed — show chosen slot + change button */
              <div className="cart-page__slot-chosen">
                <div className="cart-page__slot-badge">
                  <span className="cart-page__slot-clock">&#9201;</span>
                  <span className="cart-page__slot-time">{slotRange(selectedSlot)}</span>
                </div>
                <button
                  type="button"
                  className="cart-page__slot-change"
                  onClick={() => setSlotOpen(true)}
                >
                  Modifier
                </button>
              </div>
            )}
          </div>

          {/* ── Loyalty credit ── */}
          {pts >= 50 && (
            <div className="cart-page__loyalty">
              <p className="cart-page__loyalty-notice">
                Vous avez <strong>5€ de crédit fidélité</strong> disponible !
              </p>
              <label className="cart-page__loyalty-label">
                <input
                  type="checkbox"
                  className="cart-page__loyalty-check"
                  checked={applyCredit}
                  onChange={(e) => setApplyCredit(e.target.checked)}
                />
                <span>Utiliser mon crédit (−5€)</span>
              </label>
            </div>
          )}

          {/* ── Summary + CTA ── */}
          <div className="cart-page__summary">
            <div className="cart-page__summary-row">
              <span>Sous-total</span>
              <span>{totalAmount.toFixed(2).replace('.', ',')} €</span>
            </div>
            {creditApplied > 0 && (
              <div className="cart-page__summary-row cart-page__summary-credit">
                <span>Crédit fidélité</span>
                <span>−{creditApplied.toFixed(2).replace('.', ',')} €</span>
              </div>
            )}
            <div className="cart-page__summary-row cart-page__summary-total">
              <span>Total</span>
              <span>{finalAmount.toFixed(2).replace('.', ',')} €</span>
            </div>

            <button
              type="button"
              className="cart-page__proceed"
              onClick={handleProceed}
              disabled={!selectedSlot || slots.length === 0}
            >
              Procéder au paiement
            </button>
          </div>

          {/* ── Bottom brand image ── */}
          <div className="cart-page__banner">
            <img src="/images/hero.jpg" alt="Oh My Matcha" className="cart-page__banner-img" />
          </div>
        </>
      )}
    </main>
  );
}
