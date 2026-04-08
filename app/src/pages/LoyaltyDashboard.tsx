import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LoyaltyHistoryEntry } from '../types/user.types';
import './LoyaltyDashboard.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const LOYALTY_TARGET = 50;
const LOYALTY_REWARD = 5;

interface LoyaltyData {
  loyaltyPoints: number;
  loyaltyHistory: LoyaltyHistoryEntry[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function LoyaltyDashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/users/me/loyalty`, { credentials: 'include' })
      .then((r) => r.json() as Promise<LoyaltyData>)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const pts = data?.loyaltyPoints ?? user?.loyaltyPoints ?? 0;
  const history = data?.loyaltyHistory ?? user?.loyaltyHistory ?? [];
  const pct = Math.min((pts / LOYALTY_TARGET) * 100, 100);
  const remaining = Math.max(LOYALTY_TARGET - pts, 0);

  return (
    <div className="loyalty-page">
      <Link to="/account" className="loyalty-page__back">← Mon compte</Link>

      <h1 className="loyalty-page__title">Programme fidélité</h1>

      {/* ── Points card ── */}
      <div className="loyalty-card">
        <div className="loyalty-card__pts-wrap">
          <span className="loyalty-card__pts">{pts}</span>
          <span className="loyalty-card__pts-label">points</span>
        </div>

        <div className="loyalty-card__bar-wrap">
          <div
            className="loyalty-card__bar"
            role="progressbar"
            aria-valuenow={pts}
            aria-valuemin={0}
            aria-valuemax={LOYALTY_TARGET}
          >
            <div className="loyalty-card__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="loyalty-card__bar-labels">
            <span>0</span>
            <span>{LOYALTY_TARGET} pts</span>
          </div>
        </div>

        {pts >= LOYALTY_TARGET ? (
          <p className="loyalty-card__status loyalty-card__status--unlocked">
            🎉 Vous avez {LOYALTY_REWARD}€ de crédit disponibles !<br />
            <span>Il sera proposé automatiquement lors de votre prochaine commande.</span>
          </p>
        ) : (
          <p className="loyalty-card__status">
            Encore <strong>{remaining} pts</strong> pour débloquer {LOYALTY_REWARD}€ de crédit
          </p>
        )}

        <p className="loyalty-card__rule">1€ dépensé = 1 point</p>
      </div>

      {/* ── History ── */}
      <h2 className="loyalty-page__subtitle">Historique</h2>

      {loading && <p className="loyalty-page__status">Chargement…</p>}

      {!loading && history.length === 0 && (
        <p className="loyalty-page__status">
          Aucun mouvement de points pour l'instant.{' '}
          <Link to="/menu" className="loyalty-page__link">Commander maintenant</Link>
        </p>
      )}

      {!loading && history.length > 0 && (
        <ul className="loyalty-history">
          {[...history].reverse().map((entry, i) => (
            <li key={i} className="loyalty-history__row">
              <div className="loyalty-history__info">
                <span className="loyalty-history__reason">{entry.reason}</span>
                <span className="loyalty-history__date">{formatDate(entry.date)}</span>
              </div>
              <span className={`loyalty-history__amount ${entry.amount >= 0 ? 'loyalty-history__amount--plus' : 'loyalty-history__amount--minus'}`}>
                {entry.amount >= 0 ? '+' : ''}{entry.amount} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
