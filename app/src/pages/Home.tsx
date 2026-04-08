import { Fragment } from 'react';
import './Home.css';

const FEATURES = [
  {
    id: 'matcha',
    alt: 'Verre de matcha latte',
    text: 'MATCHA DE CÉRÉMONIE SOURCÉ DIRECTEMENT À UJI, JAPON. PUR, LATTE OU GLACÉ.',
  },
  {
    id: 'tapioca',
    alt: 'Bubble tea perles de tapioca',
    text: 'DES PERLES DE TAPIOCA FRAÎCHES CUISINÉES CHAQUE MATIN. À PERSONNALISER SANS LIMITE.',
  },
  {
    id: 'mochi',
    alt: 'Mochis et cookies artisanaux',
    text: 'LE GOÛT DU JAPON EN UNE BOUCHÉE : COOKIES MATCHA-CHOCOLAT BLANC ET MOCHIS ARTISANAUX.',
  },
];

const GALLERY = [1, 2, 3, 4, 5];

export default function Home() {
  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="home__hero">
        <img src="/images/logo.png" alt="Oh My Matcha" className="home__logo" />
        <img src="/images/hero.jpg" alt="Matcha premium" className="home__hero-img" />
      </section>

      {/* ── Tagline ── */}
      <p className="home__tagline">Le rituel vert qui réveille tes sens</p>

      {/* ── Gallery strip ── */}
      <div className="home__gallery" aria-label="Galerie photos">
        {GALLERY.map((n) => (
          <img
            key={n}
            src={`/images/gallery-${n}.jpg`}
            alt={`Photo matcha ${n}`}
            className="home__gallery-item"
          />
        ))}
      </div>

      {/* ── Section title ── */}
      <h2 className="home__art-title">L'ART DU MATCHA, SANS COMPROMIS.</h2>

      {/* ── Features ── */}
      <section className="home__features">
        {FEATURES.map((feature, i) => (
          <Fragment key={feature.id}>
            {i > 0 && <hr className="home__divider" />}
            <div className="home__feature">
              <img
                src={`/images/${feature.id}.jpg`}
                alt={feature.alt}
                className="home__feature-img"
              />
              <p className="home__feature-text">{feature.text}</p>
            </div>
          </Fragment>
        ))}
      </section>

      {/* ── Bottom banner ── */}
      <section className="home__bottom">
        <img src="/images/bottom-banner.jpg" alt="Chocolat et matcha" className="home__bottom-img" />
        <p className="home__bottom-tagline">La pause matcha qui change ta journée</p>
      </section>

    </div>
  );
}
