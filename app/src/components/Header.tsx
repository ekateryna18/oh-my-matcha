import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'header__link header__link--active' : 'header__link';
}

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="header__inner">

        <Link to="/" className="header__logo" onClick={close}>
          <img src="/images/logo.png" alt="Oh My Matcha" className="header__logo-img" />
        </Link>

        <button
          className={`header__burger${open ? ' header__burger--open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="main-nav"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="main-nav"
          className={`header__nav${open ? ' header__nav--open' : ''}`}
          aria-label="Navigation principale"
        >
          <NavLink to="/menu" className={navClass} onClick={close}>
            Commander
          </NavLink>
          <NavLink to="/salon" className={navClass} onClick={close}>
            Le Salon
          </NavLink>
          <NavLink to="/fidelite" className={navClass} onClick={close}>
            Fidélité
          </NavLink>

          {user ? (
            <>
              <NavLink to="/cart" className={navClass} onClick={close}>
                Panier
              </NavLink>
              <NavLink to="/account" className={navClass} onClick={close}>
                Mon compte
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className={navClass} onClick={close}>
              Se connecter
            </NavLink>
          )}
        </nav>

      </div>
    </header>
  );
}
