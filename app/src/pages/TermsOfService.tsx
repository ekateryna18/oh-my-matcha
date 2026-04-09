import './Legal.css';

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <h1 className="legal-page__title">Conditions Générales</h1>
      <p className="legal-page__updated">Applicables à toutes les commandes click &amp; collect — Avril 2026</p>

      {/* ── CGV ── */}
      <div className="legal-page__section">
        <h2>Conditions Générales de Vente (CGV)</h2>
      </div>

      <div className="legal-page__section">
        <h2>1. Objet</h2>
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Oh My Matcha SAS (ci-après « le Vendeur ») et toute personne physique passant une commande via le site oh-my-matcha.fr (ci-après « le Client »). Toute commande implique l'acceptation pleine et entière des présentes CGV.</p>
      </div>

      <div className="legal-page__section">
        <h2>2. Produits et disponibilité</h2>
        <p>Oh My Matcha propose une gamme de boissons à base de matcha et de bubble tea, disponibles à la commande via la formule click &amp; collect. Les produits sont proposés dans la limite des stocks disponibles.</p>
        <p>En cas de rupture de stock après validation de commande, le Client en sera informé et une solution alternative ou un remboursement intégral lui sera proposé.</p>
      </div>

      <div className="legal-page__section">
        <h2>3. Processus de commande</h2>
        <p>La commande se déroule en trois étapes :</p>
        <ul>
          <li>Sélection des produits dans le catalogue en ligne.</li>
          <li>Choix du créneau de retrait (tranches de 15 minutes) et saisie des informations de compte.</li>
          <li>Paiement sécurisé et confirmation de commande.</li>
        </ul>
        <p>La commande est définitivement validée à réception du paiement.</p>
      </div>

      <div className="legal-page__section">
        <h2>4. Prix</h2>
        <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC). Oh My Matcha SAS se réserve le droit de modifier ses prix à tout moment ; les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
      </div>

      <div className="legal-page__section">
        <h2>5. Paiement</h2>
        <p>Le paiement s'effectue en ligne, au moment de la commande. Les moyens de paiement acceptés sont : carte bancaire (Visa, Mastercard, CB).</p>
        <div className="legal-page__highlight">
          Les données bancaires ne sont jamais stockées par Oh My Matcha SAS.
        </div>
      </div>

      <div className="legal-page__section">
        <h2>6. Retrait click &amp; collect</h2>
        <p>Le Client retire sa commande directement en salon, au créneau sélectionné lors de la commande. En cas de retard ou d'absence sans annulation préalable, la commande sera maintenue pendant 30 minutes au-delà du créneau prévu, puis annulée sans remboursement.</p>
      </div>

      <div className="legal-page__section">
        <h2>7. Droit de rétractation</h2>
        <p>Conformément à l'article L.221-28 du Code de la consommation, les denrées alimentaires et boissons préparées à la commande sont <strong>exclues du droit de rétractation de 14 jours</strong>. Aucune rétractation ne peut être exercée après validation d'une commande click &amp; collect.</p>
      </div>

      <div className="legal-page__section">
        <h2>8. Remboursement et réclamations</h2>
        <p>Toute réclamation concernant un produit défectueux ou non conforme doit être signalée dans les 24 heures suivant le retrait, par e-mail à : <a href="mailto:contact@oh-my-matcha.fr">contact@oh-my-matcha.fr</a>.</p>
      </div>

      <div className="legal-page__section">
        <h2>9. Programme de fidélité</h2>
        <p>Le programme de fidélité attribue 1 point par euro dépensé. À 50 points, le Client bénéficie d'un crédit de 5 € sur sa prochaine commande. Les points ne sont pas convertibles en espèces, non transférables et expirent en cas d'inactivité supérieure à 3 ans.</p>
      </div>

      <div className="legal-page__section">
        <h2>10. Droit applicable</h2>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, le Client peut recourir à une solution amiable via une plateforme de médiation de la consommation. À défaut, les tribunaux français seront compétents.</p>
      </div>

      {/* ── CGU ── */}
      <div className="legal-page__section" style={{ marginTop: '2.5rem' }}>
        <h2>Conditions Générales d'Utilisation (CGU)</h2>
      </div>

      <div className="legal-page__section">
        <h2>11. Objet et acceptation</h2>
        <p>Les présentes CGU définissent les règles d'accès et d'utilisation du site oh-my-matcha.fr. L'accès au site vaut acceptation sans réserve des présentes CGU.</p>
      </div>

      <div className="legal-page__section">
        <h2>12. Accès au site</h2>
        <p>Le site est accessible 24h/24, 7j/7, sauf interruption pour maintenance ou cas de force majeure. L'accès à certaines fonctionnalités (commande, programme de fidélité, historique) nécessite la création d'un compte utilisateur.</p>
      </div>

      <div className="legal-page__section">
        <h2>13. Création et gestion du compte</h2>
        <p>L'utilisateur s'engage à fournir des informations exactes et à jour. Il est seul responsable de la confidentialité de ses identifiants.</p>
        <p>L'utilisateur peut à tout moment modifier ses informations personnelles, consulter son historique de commandes et supprimer son compte depuis son espace personnel.</p>
      </div>

      <div className="legal-page__section">
        <h2>14. Comportement de l'utilisateur</h2>
        <p>Sont notamment interdits :</p>
        <ul>
          <li>Toute tentative d'accès non autorisé aux systèmes du site.</li>
          <li>L'utilisation du site à des fins frauduleuses ou illégales.</li>
          <li>La création de comptes multiples pour contourner les règles du programme de fidélité.</li>
        </ul>
      </div>

      <div className="legal-page__section">
        <h2>15. Newsletter</h2>
        <p>L'inscription à la newsletter est soumise au consentement explicite de l'utilisateur (case à cocher non pré-cochée). L'utilisateur peut se désinscrire à tout moment depuis son espace personnel.</p>
      </div>

      <div className="legal-page__section">
        <h2>16. Modifications des CGU</h2>
        <p>Oh My Matcha SAS se réserve le droit de modifier les présentes CGU. Les utilisateurs seront informés des modifications significatives. La poursuite de l'utilisation du site après notification vaut acceptation.</p>
      </div>
    </main>
  );
}
