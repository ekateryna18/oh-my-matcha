import { useState } from 'react';
import { shouldShowBanner } from '../lib/ConsentManager';
import { useConsent } from '../hooks/useConsent';
import './CookieBanner.css';
import './CookieConsent.css';

// ─── Category row (local to this file) ───────────────────────────────────────

interface CategoryRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

function CategoryRow({ label, description, checked, disabled = false, onChange }: CategoryRowProps) {
  return (
    <div className="cookie-category">
      <div className="cookie-category__info">
        <span className="cookie-category__label">{label}</span>
        <span className="cookie-category__desc">{description}</span>
      </div>
      <label className="cookie-toggle">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="cookie-toggle__slider" />
      </label>
    </div>
  );
}

// ─── CookieBanner ─────────────────────────────────────────────────────────────

/**
 * Fixed bottom banner — shown on first visit or when CONSENT_VERSION changes.
 * Disappears after the user makes a choice.
 *
 * Usage: <CookieBanner /> in App.tsx (always rendered, self-hides when not needed)
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(() => shouldShowBanner());
  const [marketing, setMarketing] = useState(false);
  const [functional, setFunctional] = useState(false);
  const { updateConsents } = useConsent();

  if (!visible) return null;

  async function handleAcceptAll() {
    await updateConsents({ marketing: true, functional: true });
    setVisible(false);
  }

  async function handleRejectAll() {
    await updateConsents({ marketing: false, functional: false });
    setVisible(false);
  }

  async function handleSave() {
    await updateConsents({ marketing, functional });
    setVisible(false);
  }

  return (
    <div className="cookie-banner" role="dialog" aria-modal="true" aria-label="Préférences cookies">
      <div className="cookie-banner__inner">

        <div className="cookie-banner__header">
          <h3 className="cookie-banner__title">🍵 Vos préférences cookies</h3>
          <p className="cookie-banner__desc">
            Nous utilisons des cookies pour faire fonctionner le site et améliorer votre expérience.
            Choisissez lesquels vous souhaitez activer. Les cookies techniques sont obligatoires.
          </p>
        </div>

        <div className="cookie-banner__categories">
          <CategoryRow
            label="Cookies techniques"
            description="Authentification, panier, session. Toujours actifs — nécessaires au fonctionnement du site."
            checked={true}
            disabled={true}
          />
          <CategoryRow
            label="Marketing"
            description="Newsletter et suivi Brevo. Activés uniquement si vous vous inscrivez à la newsletter."
            checked={marketing}
            onChange={setMarketing}
          />
          <CategoryRow
            label="Fonctionnels"
            description="Mémorisation de votre créneau de retrait préféré."
            checked={functional}
            onChange={setFunctional}
          />
        </div>

        <div className="cookie-banner__actions">
          <button className="cc-btn cc-btn--ghost" onClick={handleRejectAll}>
            Tout refuser
          </button>
          <button className="cc-btn cc-btn--outline" onClick={handleSave}>
            Enregistrer mes choix
          </button>
          <button className="cc-btn cc-btn--primary" onClick={handleAcceptAll}>
            Tout accepter
          </button>
        </div>

        <p className="cookie-banner__link">
          <a href="/cookies">En savoir plus sur nos cookies</a>
        </p>

      </div>
    </div>
  );
}
