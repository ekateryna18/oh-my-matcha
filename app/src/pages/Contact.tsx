import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', rgpd: false });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    setForm((f) => ({
      ...f,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.rgpd) {
      setError('Veuillez accepter la politique de confidentialité pour envoyer votre message.');
      return;
    }
    setSent(true);
  }

  return (
    <div className="contact">
      <h1 className="contact__title">CONTACT</h1>

      <p className="contact__tagline">
        Une question, une envie ou juste envie de nous dire bonjour&nbsp;? On est là pour toi.
        Écris-nous, on te répond avec plaisir le plus vite possible.
      </p>

      <div className="contact__layout">

        {/* ── Left column — infos ── */}
        <div className="contact__col contact__col--info">
          <div className="contact__block">
            <h2 className="contact__block-title">Nous trouver</h2>
            <address className="contact__address">
              70 Rue de Suisse, Nice 06000<br />
              <a href="tel:+33778452432">07 78 45 24 32</a><br />
              <a href="mailto:hello@ohmymatcha.com">hello@ohmymatcha.com</a>
            </address>
          </div>

          <div className="contact__block">
            <h2 className="contact__block-title">Horaires d'ouverture</h2>
            <table className="contact__hours">
              <tbody>
                <tr>
                  <td>Lundi – Vendredi</td>
                  <td>08h00 – 19h00</td>
                </tr>
                <tr>
                  <td>Samedi – Dimanche</td>
                  <td>10h00 – 20h00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="contact__block">
            <h2 className="contact__block-title">FAQ</h2>
            <details className="contact__faq-item">
              <summary>Puis-je annuler ma commande Click &amp; Collect&nbsp;?</summary>
              <p>Oui, contactez-nous par téléphone 30&nbsp;min avant le créneau.</p>
            </details>
            <details className="contact__faq-item">
              <summary>Mon produit n'était pas conforme, que faire&nbsp;?</summary>
              <p>Signalez-le par e-mail dans les 24&nbsp;h suivant le retrait — on trouve une solution.</p>
            </details>
          </div>
        </div>

        {/* ── Right column — form ── */}
        <div className="contact__col contact__col--form">
          {sent ? (
            <div className="contact__success" role="status">
              <span className="contact__success-icon">✓</span>
              <p>Message envoyé&nbsp;! On te répond très vite.</p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <div className="contact__field">
                <label className="contact__label" htmlFor="c-name">Prénom / Nom</label>
                <input
                  id="c-name"
                  name="name"
                  className="contact__input"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Marie Dupont"
                  autoComplete="name"
                />
              </div>
              <div className="contact__field">
                <label className="contact__label" htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  className="contact__input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="marie@exemple.fr"
                  autoComplete="email"
                />
              </div>
              <div className="contact__field">
                <label className="contact__label" htmlFor="c-subject">Objet</label>
                <input
                  id="c-subject"
                  name="subject"
                  className="contact__input"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Question sur ma commande…"
                />
              </div>
              <label className="contact__rgpd">
                <input
                  type="checkbox"
                  name="rgpd"
                  checked={form.rgpd}
                  onChange={handleChange}
                />
                <span>
                  J'accepte que mes données soient utilisées pour traiter ma demande,
                  conformément à la{' '}
                  <Link to="/privacy">politique de confidentialité</Link>.
                </span>
              </label>
              {error && <p className="contact__error" role="alert">{error}</p>}
              <button type="submit" className="contact__btn">Envoyer</button>
            </form>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="contact__map-wrap">
        <iframe
          className="contact__map"
          title="Localisation Oh My Matcha — Nice, Rue de Suisse"
          src="https://www.openstreetmap.org/export/embed.html?bbox=7.2540%2C43.6955%2C7.2665%2C43.7015&layer=mapnik&marker=43.6985%2C7.2605"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <p className="contact__bottom">
        On est là pour toi. Que ce soit pour une question sur ta commande, sur nos ingrédients
        ou pour organiser ton événement — écris-nous ou passe nous voir au salon&nbsp;!
      </p>
    </div>
  );
}
