import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types/order.types';
import './Payment.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

interface CartState {
  pickupSlot: string;
  applyCredit: boolean;
  totalAmount: number;
  creditApplied: number;
  finalAmount: number;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatCardNumber(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function slotRange(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const end = h * 60 + m + 15;
  return `${time} - ${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateCard(number: string, expiry: string, cvv: string, name: string): string | null {
  if (number.replace(/\s/g, '').length !== 16) return 'Numéro de carte invalide — 16 chiffres requis.';

  const parts = expiry.split('/');
  if (parts.length !== 2) return 'Date d\'expiration invalide — format MM/AA.';
  const mm = parseInt(parts[0], 10);
  const yy = parseInt(parts[1], 10);
  if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) return 'Date d\'expiration invalide.';
  const now = new Date();
  const expYear = 2000 + yy;
  if (expYear < now.getFullYear() || (expYear === now.getFullYear() && mm < now.getMonth() + 1)) {
    return 'Cette carte est expirée.';
  }

  if (!/^\d{3}$/.test(cvv)) return 'CVV invalide — 3 chiffres requis.';
  if (!name.trim()) return 'Veuillez saisir le nom du titulaire.';

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Payment() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CartState | null;

  const [billing, setBilling] = useState({
    street: user?.billingAddress?.street ?? '',
    city:   user?.billingAddress?.city   ?? '',
    zip:    user?.billingAddress?.zip    ?? '',
  });
  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvv,        setCvv]        = useState('');
  const [cardName,   setCardName]   = useState('');

  const [error,  setError]  = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  // Redirect if navigated to directly (no cart state)
  if (!state) return <Navigate to="/cart" replace />;

  function handleBillingChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBilling((b) => ({ ...b, [e.target.name]: e.target.value }));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate billing
    if (!billing.street.trim() || !billing.city.trim() || !billing.zip.trim()) {
      setError('Veuillez renseigner votre adresse de facturation complète.');
      return;
    }

    // Validate card
    const cardError = validateCard(cardNumber, expiry, cvv, cardName);
    if (cardError) { setError(cardError); return; }

    setPaying(true);
    try {
      // 1. Save billing address on user
      const billingRes = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ billingAddress: billing }),
      });
      if (!billingRes.ok) {
        setError('Impossible d\'enregistrer l\'adresse de facturation.');
        return;
      }

      // 2. Create order (cart is read server-side)
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pickupSlot: state.pickupSlot, applyCredit: state.applyCredit }),
      });
      if (!orderRes.ok) {
        const data = await orderRes.json() as { message?: string };
        setError(data.message ?? 'Impossible de créer la commande.');
        return;
      }
      const order = await orderRes.json() as Order & { _id: string };

      // 3. Confirm order (credits points + clears cart)
      const confirmRes = await fetch(`${API_URL}/orders/${order._id}/confirm`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!confirmRes.ok) {
        setError('Impossible de confirmer la commande. Veuillez réessayer.');
        return;
      }
      const confirmed = await confirmRes.json() as Order;

      // 4. Refresh user (loyalty points updated by backend)
      const meRes = await fetch(`${API_URL}/users/me`, { credentials: 'include' });
      if (meRes.ok) login(await meRes.json());

      navigate('/order/success', { state: { order: confirmed }, replace: true });
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="payment-page">
      <Link to="/cart" className="payment-page__back">← Retour au panier</Link>

      <h1 className="payment-page__title">Paiement</h1>

      {/* ── Order recap ── */}
      <div className="payment-page__recap">
        <div className="payment-recap__row">
          <span>Créneau de retrait</span>
          <strong>{slotRange(state.pickupSlot)}</strong>
        </div>
        {state.creditApplied > 0 && (
          <div className="payment-recap__row payment-recap__row--credit">
            <span>Crédit fidélité</span>
            <span>−{state.creditApplied.toFixed(2).replace('.', ',')} €</span>
          </div>
        )}
        <div className="payment-recap__row payment-recap__row--total">
          <span>Total à payer</span>
          <strong>{state.finalAmount.toFixed(2).replace('.', ',')} €</strong>
        </div>
      </div>

      <form className="payment-page__form" onSubmit={handlePay} noValidate>

        {/* ── Billing address ── */}
        <fieldset className="payment-fieldset">
          <legend className="payment-fieldset__legend">Adresse de facturation</legend>

          <div className="payment-field">
            <label className="payment-field__label">Rue</label>
            <input
              name="street"
              className="payment-field__input"
              placeholder="12 rue du Matcha"
              value={billing.street}
              onChange={handleBillingChange}
              autoComplete="street-address"
              required
            />
          </div>

          <div className="payment-field-row">
            <div className="payment-field">
              <label className="payment-field__label">Ville</label>
              <input
                name="city"
                className="payment-field__input"
                placeholder="Paris"
                value={billing.city}
                onChange={handleBillingChange}
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="payment-field payment-field--zip">
              <label className="payment-field__label">Code postal</label>
              <input
                name="zip"
                className="payment-field__input"
                placeholder="75001"
                value={billing.zip}
                onChange={handleBillingChange}
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={5}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* ── Card ── */}
        <fieldset className="payment-fieldset payment-fieldset--card">
          <legend className="payment-fieldset__legend">
            <svg className="payment-fieldset__lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Paiement sécurisé
          </legend>

          <p className="payment-fieldset__notice">
            Simulation uniquement — aucune donnée bancaire réelle n'est transmise.
          </p>

          <div className="payment-field">
            <label className="payment-field__label">Numéro de carte</label>
            <input
              className="payment-field__input payment-field__input--mono"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              inputMode="numeric"
              maxLength={19}
              autoComplete="cc-number"
              required
            />
          </div>

          <div className="payment-field-row">
            <div className="payment-field">
              <label className="payment-field__label">Date d'expiration</label>
              <input
                className="payment-field__input payment-field__input--mono"
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
                maxLength={5}
                autoComplete="cc-exp"
                required
              />
            </div>
            <div className="payment-field payment-field--cvv">
              <label className="payment-field__label">CVV</label>
              <input
                className="payment-field__input payment-field__input--mono"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                inputMode="numeric"
                maxLength={3}
                autoComplete="cc-csc"
                required
              />
            </div>
          </div>

          <div className="payment-field">
            <label className="payment-field__label">Titulaire de la carte</label>
            <input
              className="payment-field__input"
              placeholder="Prénom Nom"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              autoComplete="cc-name"
              required
            />
          </div>
        </fieldset>

        {error && <p className="payment-page__error" role="alert">{error}</p>}

        <button type="submit" className="payment-page__pay" disabled={paying}>
          {paying
            ? 'Traitement en cours…'
            : `Payer ${state.finalAmount.toFixed(2).replace('.', ',')} €`}
        </button>

        <button
          type="button"
          className="payment-page__cancel"
          onClick={() => navigate('/order/cancel')}
          disabled={paying}
        >
          Annuler la commande
        </button>

      </form>
    </main>
  );
}
