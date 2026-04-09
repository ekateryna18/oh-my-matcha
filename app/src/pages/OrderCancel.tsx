import { Link } from 'react-router-dom';
import './OrderCancel.css';

export default function OrderCancel() {
  return (
    <main className="cancel-page">
      <div className="cancel-page__icon" aria-hidden="true">×</div>
      <h1 className="cancel-page__title">Commande annulée</h1>
      <p className="cancel-page__sub">
        Votre commande n'a pas été passée. Votre panier est toujours disponible.
      </p>
      <div className="cancel-page__actions">
        <Link to="/cart" className="cancel-page__btn cancel-page__btn--primary">
          Retourner au panier
        </Link>
        <Link to="/menu" className="cancel-page__btn cancel-page__btn--ghost">
          Voir le menu
        </Link>
      </div>
    </main>
  );
}
