import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header__inner">

        <Link to="/" className="header__logo">
          🍵 Oh My Matcha
        </Link>

        <nav className="header__nav" aria-label="Navigation principale">
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'header__link header__link--active' : 'header__link'}>
            Menu
          </NavLink>

          {user ? (
            <>
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'header__link header__link--active' : 'header__link'}>
                Panier
              </NavLink>
              <NavLink to="/account" className={({ isActive }) => isActive ? 'header__link header__link--active' : 'header__link'}>
                Mon compte
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'header__link header__link--active' : 'header__link'}>
              Se connecter
            </NavLink>
          )}
        </nav>

      </div>
    </header>
  );
}
