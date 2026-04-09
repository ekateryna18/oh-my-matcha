import { useLocation, Link, Navigate } from 'react-router-dom';
import type { Order } from '../types/order.types';
import './OrderSuccess.css';

function slotRange(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const end = h * 60 + m + 15;
  return `${time} - ${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
}

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state as { order: Order } | null;

  if (!state?.order) return <Navigate to="/" replace />;

  const { order } = state;

  return (
    <main className="success-page">
      <div className="success-page__icon" aria-hidden="true">✓</div>

      <h1 className="success-page__title">Commande confirmée !</h1>
      <p className="success-page__sub">Merci pour votre commande. À tout de suite !</p>

      <div className="success-page__card">
        <div className="success-card__row">
          <span className="success-card__label">Numéro de commande</span>
          <span className="success-card__value success-card__value--bold">{order.orderNumber}</span>
        </div>

        <div className="success-card__row">
          <span className="success-card__label">Créneau de retrait</span>
          <span className="success-card__value success-card__value--bold">{slotRange(order.pickupSlot)}</span>
        </div>

        <div className="success-card__divider" />

        <ul className="success-card__items">
          {order.items.map((item, i) => (
            <li key={i} className="success-card__item">
              <span>{item.quantity}× {item.name}</span>
              <span>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
            </li>
          ))}
        </ul>

        <div className="success-card__divider" />

        {order.creditApplied > 0 && (
          <div className="success-card__row">
            <span className="success-card__label">Crédit fidélité</span>
            <span className="success-card__value success-card__value--green">
              −{order.creditApplied.toFixed(2).replace('.', ',')} €
            </span>
          </div>
        )}

        <div className="success-card__row">
          <span className="success-card__label">Total payé</span>
          <span className="success-card__value success-card__value--bold">
            {order.finalAmount.toFixed(2).replace('.', ',')} €
          </span>
        </div>

        {order.loyaltyPointsEarned > 0 && (
          <div className="success-card__points">
            +{order.loyaltyPointsEarned} point{order.loyaltyPointsEarned > 1 ? 's' : ''} de fidélité crédités
          </div>
        )}
      </div>

      <div className="success-page__actions">
        <Link to="/menu" className="success-page__btn success-page__btn--primary">
          Commander à nouveau
        </Link>
        <Link to="/account" className="success-page__btn success-page__btn--ghost">
          Voir mon compte
        </Link>
      </div>
    </main>
  );
}
