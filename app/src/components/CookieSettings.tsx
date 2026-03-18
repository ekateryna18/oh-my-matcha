import { useEffect, useState } from 'react';
import { useConsent } from '../hooks/useConsent';
import './CookieSettings.css';
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

// ─── CookieSettings ───────────────────────────────────────────────────────────

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for managing cookie preferences.
 * Accessible from the footer ("Gérer mes cookies") and the Account page.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <CookieSettings isOpen={open} onClose={() => setOpen(false)} />
 */
export function CookieSettings({ isOpen, onClose }: CookieSettingsProps) {
  const { consents, updateConsents } = useConsent();
  const [marketing, setMarketing] = useState(consents?.marketing ?? false);
  const [functional, setFunctional] = useState(consents?.functional ?? false);

  // Sync local toggle state each time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setMarketing(consents?.marketing ?? false);
      setFunctional(consents?.functional ?? false);
    }
  }, [isOpen, consents]);

  if (!isOpen) return null;

  async function handleAcceptAll() {
    await updateConsents({ marketing: true, functional: true });
    onClose();
  }

  async function handleRejectAll() {
    await updateConsents({ marketing: false, functional: false });
    onClose();
  }

  async function handleSave() {
    await updateConsents({ marketing, functional });
    onClose();
  }

  return (
    <div
      className="cs-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="cs-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Paramètres cookies"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="cs-modal__header">
          <h3 className="cs-modal__title">🍵 Gérer mes cookies</h3>
          <button className="cs-modal__close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <p className="cs-modal__intro">
          Gérez vos préférences à tout moment. Les cookies techniques sont toujours actifs
          car ils sont nécessaires au bon fonctionnement du site.
        </p>

        <div className="cs-modal__categories">
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

        <div className="cs-modal__actions">
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

      </div>
    </div>
  );
}
