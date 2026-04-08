import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { getConsents } from '../lib/ConsentManager';
import type { User } from '../types/user.types';
import './auth.css';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    acceptPrivacy: false,
    newsletterSubscribed: false,
  });
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Send stored cookie consents with registration (GDPR requirement)
    const stored = getConsents();
    const cookieConsents = {
      marketing:  stored?.marketing  ?? false,
      functional: stored?.functional ?? false,
      version:    stored?.version    ?? '1.0',
    };

    if (!form.acceptPrivacy) {
      setError('Vous devez accepter la politique de confidentialité pour créer un compte.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cookieConsents }),
      });

      if (res.status === 409) {
        setError('Un compte avec cet email existe déjà.');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null) as { message?: string | string[] } | null;
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        setError(msg ?? 'Certains champs sont invalides. Vérifiez le formulaire.');
        return;
      }

      // Auto-login after successful registration
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (loginRes.ok) {
        const user = (await loginRes.json()) as User;
        login(user);
        navigate('/', { replace: true });
      } else {
        // Register succeeded but auto-login failed — send to login
        navigate('/login');
      }
    } catch {
      setError('Impossible de créer le compte. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-card__title">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="firstName" className="auth-form__label">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="auth-form__input"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="auth-form__field">
              <label htmlFor="lastName" className="auth-form__label">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="auth-form__input"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-form__input"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">
              Mot de passe{' '}
              <span className="auth-form__hint">(8 caractères min.)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-form__input"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="phoneNumber" className="auth-form__label">Téléphone</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="auth-form__input"
              value={form.phoneNumber}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="dateOfBirth" className="auth-form__label">Date de naissance</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              className="auth-form__input"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Privacy policy — mandatory (RGPD) */}
          <label className="auth-form__checkbox">
            <input
              type="checkbox"
              name="acceptPrivacy"
              checked={form.acceptPrivacy}
              onChange={handleChange}
            />
            <span>
              J'ai lu et j'accepte la{' '}
              <Link to="/privacy" target="_blank">politique de confidentialité</Link>
              {' '}et les{' '}
              <Link to="/terms" target="_blank">conditions d'utilisation</Link>.{' '}
              <span className="auth-form__required">*</span>
            </span>
          </label>

          {/* Newsletter opt-in — unchecked by default (CNIL requirement) */}
          <label className="auth-form__checkbox">
            <input
              type="checkbox"
              name="newsletterSubscribed"
              checked={form.newsletterSubscribed}
              onChange={handleChange}
            />
            <span>
              Je souhaite recevoir les offres et actualités Oh My Matcha par email.{' '}
              <span className="auth-form__hint">(facultatif)</span>
            </span>
          </label>

          {error && <p className="auth-form__error" role="alert">{error}</p>}

          <button type="submit" className="auth-form__btn" disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-card__link">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
