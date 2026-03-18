import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CookieSettings } from './CookieSettings';
import './Footer.css';

export function Footer() {
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="footer__inner">

        <p className="footer__brand">🍵 Oh My Matcha — Paris</p>

        <nav className="footer__links" aria-label="Liens légaux">
          <Link to="/privacy" className="footer__link">Politique de confidentialité</Link>
          <Link to="/terms" className="footer__link">CGV</Link>
          <Link to="/legal" className="footer__link">Mentions légales</Link>
          <Link to="/cookies" className="footer__link">Politique cookies</Link>
          {/* CNIL requirement — must always be visible in footer */}
          <button
            className="footer__link footer__link--btn"
            onClick={() => setCookieSettingsOpen(true)}
          >
            Gérer mes cookies
          </button>
        </nav>

        <p className="footer__copy">© 2026 Oh My Matcha. Tous droits réservés.</p>

      </div>

      {/* Cookie settings modal — controlled by this footer */}
      <CookieSettings
        isOpen={cookieSettingsOpen}
        onClose={() => setCookieSettingsOpen(false)}
      />
    </footer>
  );
}
