import { Link } from 'react-router-dom';
import './Legal.css';

export default function CookiePolicy() {
  return (
    <main className="legal-page">
      <h1 className="legal-page__title">Politique de cookies</h1>
      <p className="legal-page__updated">Conformément aux lignes directrices CNIL — Avril 2026</p>

      <div className="legal-page__section">
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de votre visite sur notre site. Il permet de mémoriser des informations relatives à votre navigation et d'améliorer votre expérience utilisateur.</p>
      </div>

      <div className="legal-page__section">
        <h2>2. Cookies strictement nécessaires</h2>
        <p>Ces cookies sont indispensables au bon fonctionnement du site. Ils sont activés automatiquement et <strong>ne peuvent pas être désactivés</strong>. Ils ne collectent aucune information personnelle à des fins publicitaires.</p>
        <table className="legal-page__table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Finalité</th>
              <th>Durée</th>
              <th>httpOnly</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cart_id</code></td>
              <td>Identifie le panier de l'utilisateur. Protégé contre les attaques XSS.</td>
              <td>Session</td>
              <td>Oui</td>
            </tr>
            <tr>
              <td><code>auth_token</code></td>
              <td>Maintient la session de l'utilisateur connecté. Protégé contre les attaques XSS.</td>
              <td>1 jour</td>
              <td>Oui</td>
            </tr>
            <tr>
              <td><code>omm_cookie_consent</code></td>
              <td>Mémorise vos choix de consentement. Permet de ne pas réafficher la bannière à chaque visite.</td>
              <td>6 mois</td>
              <td>Non</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="legal-page__section">
        <h2>3. Cookies soumis à consentement</h2>
        <p>Ces cookies ne sont déposés qu'après votre accord explicite via la bannière de consentement. Vous pouvez les accepter, les refuser ou les paramétrer individuellement.</p>
        <table className="legal-page__table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Finalité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>newsletter_consent</code></td>
              <td>Marketing</td>
              <td>Mémorisation de l'inscription à la newsletter et initialisation de Brevo.</td>
              <td>2 semaines</td>
            </tr>
            <tr>
              <td><code>pickup_slot_pref</code></td>
              <td>Fonctionnel</td>
              <td>Mémorisation de vos créneaux de retrait préférés pour accélérer les prochaines commandes.</td>
              <td>2 semaines</td>
            </tr>
          </tbody>
        </table>
        <div className="legal-page__highlight">
          Le site fonctionne intégralement même si vous refusez tous les cookies non nécessaires. Votre refus ne limite pas l'accès aux fonctionnalités essentielles (commande, compte, fidélité).
        </div>
      </div>

      <div className="legal-page__section">
        <h2>4. Gestion de vos préférences</h2>
        <p>Lors de votre première visite, une bannière de consentement vous est présentée. Vous pouvez :</p>
        <ul>
          <li><strong>Accepter tous les cookies</strong> en cliquant sur « Accepter tout ».</li>
          <li><strong>Refuser tous les cookies</strong> non essentiels en cliquant sur « Refuser tout ».</li>
          <li><strong>Personnaliser vos choix</strong> catégorie par catégorie en cliquant sur « Personnaliser ».</li>
        </ul>
        <p>Les boutons « Accepter tout » et « Refuser tout » ont le même poids visuel — conformément aux exigences CNIL. Tous les toggles sont décochés par défaut : votre accord doit être une démarche active.</p>
      </div>

      <div className="legal-page__section">
        <h2>5. Modifier vos préférences</h2>
        <p>Vous pouvez modifier vos préférences à tout moment depuis le lien <Link to="/account">« Préférences cookies »</Link> dans votre espace personnel, ou via le bouton <strong>Gérer mes cookies</strong> disponible en bas de chaque page.</p>
        <p>Vous pouvez également gérer ou supprimer les cookies directement depuis les paramètres de votre navigateur. La suppression des cookies strictement nécessaires peut perturber le fonctionnement du site.</p>
      </div>

      <div className="legal-page__section">
        <h2>6. Durée de conservation des préférences</h2>
        <p>Vos préférences de consentement sont conservées pour une durée maximale de 6 mois, conformément aux recommandations de la CNIL. À l'expiration de ce délai, votre consentement vous sera de nouveau demandé.</p>
      </div>

      <div className="legal-page__section">
        <h2>7. Contact</h2>
        <div className="legal-page__contact">
          Pour toute question relative à notre politique de cookies :<br />
          <a href="mailto:privacy@oh-my-matcha.fr">privacy@oh-my-matcha.fr</a><br />
          Oh My Matcha SAS — 12 rue du Thé Vert, 06000 Nice
        </div>
      </div>
    </main>
  );
}
