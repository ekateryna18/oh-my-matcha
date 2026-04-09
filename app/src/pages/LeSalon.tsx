import './LeSalon.css';

export default function LeSalon() {
  return (
    <div className="salon">
      <h1 className="salon__title">LE SALON</h1>

      {/* Shopfront photo */}
      <div className="salon__front-wrap">
        <img
          src="/images/salon-front.jpg"
          alt="Devanture Oh My Matcha, Nice"
          className="salon__front-img"
        />
      </div>

      {/* Editorial story */}
      <section className="salon__story">
        <h2 className="salon__story-heading">
          Plus qu'un salon de thé, une parenthèse zen
        </h2>
        <p className="salon__story-text">
          Nous travaillons main dans la main avec des petits producteurs japonais
          pour vous offrir un matcha d'exception, sans amertume.
        </p>
      </section>

      {/* Interior photo — full width */}
      <div className="salon__interior-wrap">
        <img
          src="/images/salon-interior.jpg"
          alt="Intérieur du salon Oh My Matcha"
          className="salon__interior-img"
        />
        <p className="salon__caption">
          Paille biodégradable, lait végétal local et emballages recyclables.
          Bon pour toi, bon pour la planète.
        </p>
      </div>

      {/* Values strip */}
      <section className="salon__values">
        <div className="salon__value">
          <span className="salon__value-icon">🍃</span>
          <strong>Matcha de cérémonie</strong>
          <p>Sourcé directement à Uji, Japon, par des producteurs partenaires.</p>
        </div>
        <div className="salon__value">
          <span className="salon__value-icon">🌱</span>
          <strong>Local &amp; végétal</strong>
          <p>Lait végétal local, pailles biodégradables, emballages recyclables.</p>
        </div>
        <div className="salon__value">
          <span className="salon__value-icon">☕</span>
          <strong>Fait à la commande</strong>
          <p>Chaque boisson est préparée au moment — zéro compromis sur la fraîcheur.</p>
        </div>
      </section>
    </div>
  );
}
