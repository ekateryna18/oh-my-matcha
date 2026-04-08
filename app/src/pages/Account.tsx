import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConsent } from '../hooks/useConsent';
import type { Order } from '../types/order.types';
import './Account.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  ready:     'Prête à retirer',
  completed: 'Terminée',
};

// ─── Personal info ─────────────────────────────────────────────────────────────

function PersonalInfo() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    firstName:   user?.firstName   ?? '',
    lastName:    user?.lastName    ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
  });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) { setError('Impossible de sauvegarder.'); return; }
      login(await res.json());
      setSuccess(true);
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="account__section">
      <h2 className="account__section-title">Informations personnelles</h2>
      <form onSubmit={handleSubmit} className="account__form">
        <div className="account__form-row">
          <div className="account__field">
            <label className="account__label">Prénom</label>
            <input name="firstName" className="account__input" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="account__field">
            <label className="account__label">Nom</label>
            <input name="lastName" className="account__input" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="account__field">
          <label className="account__label">
            Email <span className="account__hint">(non modifiable)</span>
          </label>
          <input className="account__input account__input--readonly" value={user?.email ?? ''} readOnly />
        </div>
        <div className="account__field">
          <label className="account__label">Téléphone</label>
          <input name="phoneNumber" type="tel" className="account__input" value={form.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="account__field">
          <label className="account__label">Date de naissance</label>
          <input name="dateOfBirth" type="date" className="account__input" value={form.dateOfBirth} onChange={handleChange} required />
        </div>
        {error   && <p className="account__msg account__msg--error" role="alert">{error}</p>}
        {success && <p className="account__msg account__msg--success">Modifications enregistrées ✓</p>}
        <button type="submit" className="account__btn" disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </section>
  );
}

// ─── Loyalty mini ──────────────────────────────────────────────────────────────

function LoyaltyMini() {
  const { user } = useAuth();
  const pts = user?.loyaltyPoints ?? 0;
  const pct = Math.min((pts / 50) * 100, 100);

  return (
    <section className="account__section">
      <h2 className="account__section-title">Fidélité</h2>
      <div className="loyalty-mini">
        <div className="loyalty-mini__top">
          <span className="loyalty-mini__pts">{pts} pts</span>
          {pts >= 50
            ? <span className="loyalty-mini__badge">5€ de crédit disponibles !</span>
            : <span className="loyalty-mini__sub">{50 - pts} pts pour débloquer 5€ de crédit</span>
          }
        </div>
        <div className="loyalty-mini__bar" role="progressbar" aria-valuenow={pts} aria-valuemin={0} aria-valuemax={50}>
          <div className="loyalty-mini__fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="loyalty-mini__rule">1€ dépensé = 1 point · 50 pts = 5€ de crédit</p>
        <Link to="/account/loyalty" className="account__link">Voir l'historique complet →</Link>
      </div>
    </section>
  );
}

// ─── Order history ─────────────────────────────────────────────────────────────

function OrderHistory() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users/me/orders`, { credentials: 'include' })
      .then((r) => r.json() as Promise<Order[]>)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="account__section">
      <h2 className="account__section-title">Historique des commandes</h2>
      {loading && <p className="account__status">Chargement…</p>}
      {!loading && orders.length === 0 && (
        <p className="account__status">Aucune commande pour l'instant. <Link to="/menu" className="account__link">Voir le menu</Link></p>
      )}
      {!loading && orders.length > 0 && (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-card">
              <div className="order-card__head">
                <span className="order-card__number">{order.orderNumber}</span>
                <span className={`order-card__status order-card__status--${order.status}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <ul className="order-card__items">
                {order.items.map((item, i) => (
                  <li key={i} className="order-card__item">
                    <span>{item.quantity}× {item.name}</span>
                    <span>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
                  </li>
                ))}
              </ul>
              <div className="order-card__foot">
                <span>Retrait : <strong>{order.pickupSlot}</strong></span>
                <span>
                  Total : <strong>{order.finalAmount.toFixed(2).replace('.', ',')} €</strong>
                  {order.creditApplied > 0 &&
                    <span className="order-card__credit"> (−{order.creditApplied.toFixed(2).replace('.', ',')} € crédit)</span>
                  }
                </span>
                {order.loyaltyPointsEarned > 0 &&
                  <span className="order-card__pts">+{order.loyaltyPointsEarned} pts</span>
                }
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ─── Cookie preferences ────────────────────────────────────────────────────────

function CookiePrefs() {
  const { consents, updateConsents } = useConsent();
  const [marketing,  setMarketing]  = useState(consents?.marketing  ?? false);
  const [functional, setFunctional] = useState(consents?.functional ?? false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await updateConsents({ marketing, functional });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <section className="account__section">
      <h2 className="account__section-title">Préférences cookies</h2>
      <div className="cookie-pref">
        <label className="cookie-pref__row">
          <span className="cookie-pref__info">
            <strong>Marketing</strong>
            <span className="account__hint">Newsletter et suivi Brevo</span>
          </span>
          <input
            type="checkbox"
            className="cookie-pref__check"
            checked={marketing}
            onChange={(e) => { setMarketing(e.target.checked); setSaved(false); }}
          />
        </label>
        <label className="cookie-pref__row">
          <span className="cookie-pref__info">
            <strong>Fonctionnels</strong>
            <span className="account__hint">Mémorisation du créneau préféré</span>
          </span>
          <input
            type="checkbox"
            className="cookie-pref__check"
            checked={functional}
            onChange={(e) => { setFunctional(e.target.checked); setSaved(false); }}
          />
        </label>
      </div>
      {saved && <p className="account__msg account__msg--success">Préférences enregistrées ✓</p>}
      <button className="account__btn account__btn--outline" onClick={handleSave}>
        Enregistrer mes choix
      </button>
    </section>
  );
}

// ─── Danger zone ───────────────────────────────────────────────────────────────

function DangerZone() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [confirm,  setConfirm]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok && res.status !== 204) {
        setError('Impossible de supprimer le compte. Veuillez réessayer.');
        return;
      }
      logout();
      navigate('/', { replace: true });
    } catch {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="account__section account__section--danger">
      <h2 className="account__section-title account__section-title--danger">Zone de danger</h2>
      <p className="account__danger-text">
        La suppression est définitive et irréversible. Toutes vos données personnelles seront effacées conformément au RGPD.
      </p>
      {error && <p className="account__msg account__msg--error" role="alert">{error}</p>}
      {!confirm ? (
        <button className="account__btn account__btn--danger" onClick={() => setConfirm(true)}>
          Supprimer mon compte
        </button>
      ) : (
        <div className="account__confirm">
          <p className="account__confirm-text">Êtes-vous sûr(e) ? Cette action est irréversible.</p>
          <div className="account__confirm-actions">
            <button className="account__btn account__btn--ghost" onClick={() => setConfirm(false)} disabled={deleting}>
              Annuler
            </button>
            <button className="account__btn account__btn--danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Suppression…' : 'Oui, supprimer définitivement'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Account() {
  const { user } = useAuth();
  return (
    <div className="account">
      <div className="account__header">
        <h1 className="account__title">Mon compte</h1>
        <p className="account__welcome">Bonjour, {user?.firstName} !</p>
      </div>
      <PersonalInfo />
      <LoyaltyMini />
      <OrderHistory />
      <CookiePrefs />
      <DangerZone />
    </div>
  );
}
