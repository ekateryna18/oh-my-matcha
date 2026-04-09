import './Legal.css';

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <h1 className="legal-page__title">Politique de confidentialité</h1>
      <p className="legal-page__updated">Conformément au RGPD (UE) 2016/679 — Mise à jour : avril 2026</p>

      <div className="legal-page__section">
        <h2>1. Responsable du traitement</h2>
        <div className="legal-page__contact">
          Oh My Matcha SAS — 12 rue du Thé Vert, 06000 Nice<br />
          <a href="mailto:contact@oh-my-matcha.fr">contact@oh-my-matcha.fr</a>
        </div>
      </div>

      <div className="legal-page__section">
        <h2>2. Données collectées et finalités</h2>

        <h3>2.1 Création de compte utilisateur</h3>
        <p><strong>Données :</strong> prénom, nom, adresse e-mail, mot de passe (hashé), date de naissance.</p>
        <p><strong>Finalité :</strong> gestion du compte, accès à l'historique des commandes et au programme de fidélité.</p>
        <p><strong>Base légale :</strong> exécution d'un contrat (art. 6.1.b RGPD).</p>

        <h3>2.2 Commandes click &amp; collect</h3>
        <p><strong>Données :</strong> prénom, nom, e-mail, créneau de retrait, détail de la commande, données de paiement (traitées via Stripe — jamais stockées directement).</p>
        <p><strong>Finalité :</strong> traitement et suivi de la commande, émission de la facture.</p>
        <p><strong>Base légale :</strong> exécution d'un contrat (art. 6.1.b RGPD) et obligation légale pour la facturation (art. 6.1.c RGPD).</p>

        <h3>2.3 Programme de fidélité</h3>
        <p><strong>Données :</strong> historique d'achats, cumul de points (1 € = 1 point), seuil de récompense (50 points = 5 € de crédit).</p>
        <p><strong>Finalité :</strong> gestion du programme de fidélité et attribution des avantages.</p>
        <p><strong>Base légale :</strong> exécution d'un contrat (art. 6.1.b RGPD).</p>

        <h3>2.4 Newsletter</h3>
        <p><strong>Données :</strong> adresse e-mail, consentement horodaté.</p>
        <p><strong>Finalité :</strong> envoi d'informations commerciales et d'offres exclusives.</p>
        <p><strong>Base légale :</strong> consentement de la personne (art. 6.1.a RGPD). Le consentement peut être retiré à tout moment.</p>

        <h3>2.5 Navigation et cookies analytiques</h3>
        <p><strong>Données :</strong> adresse IP anonymisée, pages visitées, durée de visite, type d'appareil.</p>
        <p><strong>Finalité :</strong> mesure d'audience, amélioration de l'expérience utilisateur (uniquement si consentement accordé).</p>
        <p><strong>Base légale :</strong> consentement de la personne (art. 6.1.a RGPD).</p>
      </div>

      <div className="legal-page__section">
        <h2>3. Durées de conservation</h2>
        <table className="legal-page__table">
          <thead>
            <tr>
              <th>Type de donnée</th>
              <th>Durée</th>
              <th>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Données de compte utilisateur</td>
              <td>Jusqu'à suppression par l'utilisateur</td>
              <td>Art. 17 RGPD</td>
            </tr>
            <tr>
              <td>Date de consentement newsletter</td>
              <td>Conservée même après désabonnement (preuve de consentement)</td>
              <td>Art. 7 RGPD</td>
            </tr>
            <tr>
              <td>Données de commande / facturation</td>
              <td>10 ans (obligation comptable)</td>
              <td>Code de commerce L.123-22</td>
            </tr>
            <tr>
              <td>Données de navigation / cookies</td>
              <td>13 mois maximum</td>
              <td>Lignes directrices CNIL 2020</td>
            </tr>
            <tr>
              <td>Données programme de fidélité</td>
              <td>Durée de la relation + 3 ans</td>
              <td>Art. 5(1)(e) RGPD</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="legal-page__section">
        <h2>4. Destinataires des données</h2>
        <p>Vos données peuvent être transmises aux sous-traitants suivants, dans le seul cadre de la réalisation de nos services :</p>
        <ul>
          <li><strong>Stripe Inc.</strong> — traitement sécurisé des paiements (certifié PCI-DSS). Données jamais stockées en direct par Oh My Matcha.</li>
          <li><strong>Prestataire d'hébergement</strong> — hébergement des données au sein de l'UE.</li>
          <li><strong>Brevo (ex-Sendinblue)</strong> — plateforme d'envoi de la newsletter. Chargé uniquement si consentement marketing accordé. Données hébergées dans l'UE.</li>
        </ul>
        <div className="legal-page__highlight">
          Aucune donnée personnelle n'est vendue, louée ou cédée à des tiers à des fins commerciales.
        </div>
      </div>

      <div className="legal-page__section">
        <h2>5. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données.</li>
          <li><strong>Droit de rectification</strong> : corriger des informations inexactes.</li>
          <li><strong>Droit à l'effacement</strong> (« droit à l'oubli ») : demander la suppression de vos données.</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
          <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements (notamment la prospection).</li>
          <li><strong>Droit de retrait du consentement</strong> : applicable aux traitements fondés sur votre consentement.</li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@oh-my-matcha.fr">privacy@oh-my-matcha.fr</a>. Réponse sous 1 mois (art. 12 RGPD).</p>
        <p>Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
      </div>

      <div className="legal-page__section">
        <h2>6. Sécurité</h2>
        <p>Oh My Matcha SAS met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement HTTPS, hachage des mots de passe (bcrypt), accès restreint aux données, cookies httpOnly pour les tokens d'authentification.</p>
      </div>
    </main>
  );
}
