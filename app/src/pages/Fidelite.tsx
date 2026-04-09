import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Fidelite.css';

export default function Fidelite() {
  const { user } = useAuth();

  return (
    <div className="fidelite">
      <h1 className="fidelite__title">FIDÉLITÉ</h1>

      <section className="fidelite__story">
        <span className="fidelite__label">OUR STORY</span>
        <div className="fidelite__story-body">
          <h2 className="fidelite__heading">Rejoins le Matcha Club</h2>
          <p className="fidelite__text">
            Chaque gorgée compte. Pour chaque 1&nbsp;€ dépensé, tu gagnes 1 point.
          </p>
          <div className="fidelite__img-wrap">
            <img
              src="/images/fidelite-hero.jpg"
              alt="Cliente tenant un téléphone avec le logo Oh My Matcha"
              className="fidelite__img"
            />
          </div>
          <p className="fidelite__text">
            50 points cumulés = 5&nbsp;€ de réduction sur ta prochaine commande.
            On t'offre même 5 points dès ton inscription à la newsletter&nbsp;!
          </p>
        </div>
      </section>

      <section className="fidelite__steps">
        <h2 className="fidelite__steps-title">Comment ça marche ?</h2>
        <ol className="fidelite__step-list">
          <li className="fidelite__step">
            <span className="fidelite__step-num">01</span>
            <div>
              <strong>Crée ton compte</strong>
              <p>Inscription gratuite en 30 secondes.</p>
            </div>
          </li>
          <li className="fidelite__step">
            <span className="fidelite__step-num">02</span>
            <div>
              <strong>Commande &amp; cumule</strong>
              <p>1&nbsp;€ dépensé = 1 point, automatiquement.</p>
            </div>
          </li>
          <li className="fidelite__step">
            <span className="fidelite__step-num">03</span>
            <div>
              <strong>Débloque ton crédit</strong>
              <p>50 pts = 5&nbsp;€ à utiliser sur ta prochaine commande.</p>
            </div>
          </li>
        </ol>
      </section>

      <div className="fidelite__cta-wrap">
        {user ? (
          <Link to="/account/loyalty" className="fidelite__cta">
            Voir mes points →
          </Link>
        ) : (
          <Link to="/register" className="fidelite__cta">
            Créer mon compte
          </Link>
        )}
      </div>
    </div>
  );
}
