import './Legal.css';

export default function LegalNotice() {
  return (
    <main className="legal-page">
      <h1 className="legal-page__title">Mentions légales</h1>
      <p className="legal-page__updated">Dernière mise à jour : avril 2026</p>

      <div className="legal-page__section">
        <h2>1. Éditeur du site</h2>
        <div className="legal-page__contact">
          <strong>Oh My Matcha SAS</strong><br />
          Forme juridique : Société par Actions Simplifiée (SAS)<br />
          Capital social : 5 000 €<br />
          SIRET : 123 456 789 12345<br />
          Adresse : 12 rue du Thé Vert, 06000 Nice<br />
          Téléphone : +33 6 12 34 56 78<br />
          Email : <a href="mailto:contact@oh-my-matcha.fr">contact@oh-my-matcha.fr</a><br />
          Directeur de publication : Oh My Matcha<br />
          TVA intracommunautaire : FR 12 345 678 901
        </div>
      </div>

      <div className="legal-page__section">
        <h2>2. Hébergement</h2>
        <p>Le site est hébergé par un prestataire établi au sein de l'Union Européenne, conformément aux exigences du RGPD :</p>
        <div className="legal-page__contact">
          <strong>OVH</strong><br />
          Adresse : [Adresse complète de l'hébergeur — UE]<br />
          Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">ovhcloud.com</a>
        </div>
      </div>

      <div className="legal-page__section">
        <h2>3. Propriété intellectuelle</h2>
        <p>L'ensemble du contenu du site oh-my-matcha.fr (textes, images, logo, charte graphique, code source) est protégé par le droit de la propriété intellectuelle et est la propriété exclusive de Oh My Matcha SAS, sauf mention contraire.</p>
        <p>Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation préalable écrite, est strictement interdite.</p>
      </div>

      <div className="legal-page__section">
        <h2>4. Responsabilité</h2>
        <p>Oh My Matcha SAS s'efforce de fournir des informations exactes et à jour. Cependant, la société ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations publiées et décline toute responsabilité pour les erreurs ou omissions.</p>
        <p>L'utilisateur est seul responsable de l'utilisation qu'il fait du site et de ses contenus.</p>
      </div>

      <div className="legal-page__section">
        <h2>5. Liens hypertextes</h2>
        <p>Le site peut contenir des liens vers des sites tiers. Oh My Matcha SAS n'exerce aucun contrôle sur ces sites et ne saurait être tenu responsable de leur contenu ou de leur politique de confidentialité.</p>
      </div>

      <div className="legal-page__section">
        <h2>6. Droit applicable</h2>
        <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        <div className="legal-page__highlight">
          Documents établis en conformité avec le RGPD (UE) 2016/679 et les recommandations CNIL.
        </div>
      </div>
    </main>
  );
}
