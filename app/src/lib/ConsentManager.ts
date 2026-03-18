/**
 * ConsentManager — core GDPR/CNIL cookie consent logic
 *
 * Cookie model (from SPECS § 9):
 * ┌──────────────────────┬────────────┬──────────────┬──────────────────────────────────────┐
 * │ Cookie               │ Category   │ Duration     │ Purpose                              │
 * ├──────────────────────┼────────────┼──────────────┼──────────────────────────────────────┤
 * │ omm_cookie_consent   │ Technical  │ 6 months     │ Stores consent choices (this file)   │
 * │ newsletter_consent   │ Marketing  │ 14 days      │ Enables Brevo init in browser        │
 * │ pickup_slot_pref     │ Functional │ 14 days      │ Remembers preferred pickup slot      │
 * │ auth_token           │ Technical  │ 1 day        │ JWT — httpOnly, never touched here   │
 * │ cart_id              │ Technical  │ Session      │ Cart — httpOnly, never touched here  │
 * │ session_id           │ Technical  │ Session      │ Session — httpOnly, never touched    │
 * └──────────────────────┴────────────┴──────────────┴──────────────────────────────────────┘
 *
 * Rules:
 * - httpOnly cookies (auth_token, cart_id, session_id) are managed by the API only
 * - This file only manages JS-accessible cookies
 * - Bump CONSENT_VERSION when the cookie policy changes → banner re-shown to all users
 */

import type { ConsentChoices, ConsentData } from '../types/consent.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const CONSENT_COOKIE = 'omm_cookie_consent';
const NEWSLETTER_COOKIE = 'newsletter_consent';
const SLOT_PREF_COOKIE = 'pickup_slot_pref';

/**
 * Current version of the cookie policy.
 * Bump this string (e.g. "1.0" → "1.1") whenever the cookie list or
 * purposes change — the banner will automatically re-appear for all users.
 */
const CONSENT_VERSION = '1.0';

const CONSENT_DURATION_DAYS = 180;
const OPTIONAL_DURATION_DAYS = 14;

// ─── Cookie utilities ─────────────────────────────────────────────────────────

/**
 * Sets a cookie with an optional expiry.
 * @param name  Cookie name
 * @param value Cookie value (will be URI-encoded)
 * @param days  Expiry in days. Omit for a session cookie.
 */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = '';
  if (days !== undefined) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

/**
 * Reads a cookie by name.
 * @returns The decoded value, or null if not found.
 */
export function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  if (!match) return null;

  try {
    return decodeURIComponent(match.split('=').slice(1).join('='));
  } catch {
    return null;
  }
}

/**
 * Deletes a cookie by setting its expiry to the past.
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

// ─── Side effects ─────────────────────────────────────────────────────────────

/**
 * Applies the side effects of consent choices.
 * Single source of truth — called both on save and on app load.
 *
 * marketing: true  → set newsletter_consent cookie (14d) + init Brevo
 * marketing: false → delete newsletter_consent cookie (Brevo not loaded)
 * functional: true → pickup_slot_pref can be written later by slot logic
 * functional: false → delete pickup_slot_pref immediately
 */
function applyConsentSideEffects(choices: ConsentChoices): void {
  if (choices.marketing) {
    setCookie(NEWSLETTER_COOKIE, 'true', OPTIONAL_DURATION_DAYS);
    initBrevo();
  } else {
    deleteCookie(NEWSLETTER_COOKIE);
  }

  if (!choices.functional) {
    deleteCookie(SLOT_PREF_COOKIE);
  }
}

/**
 * Initializes the Brevo browser script for newsletter tracking.
 * No-op until VITE_BREVO_CLIENT_KEY is set in the app .env.
 *
 * To enable: add VITE_BREVO_CLIENT_KEY=your_key to app/.env
 * and uncomment the script injection below.
 */
function initBrevo(): void {
  const key = import.meta.env.VITE_BREVO_CLIENT_KEY as string | undefined;
  if (!key) return;

  // Avoid injecting the script twice
  if (document.getElementById('brevo-script')) return;

  // TODO: uncomment when Brevo client key is configured
  // const script = document.createElement('script');
  // script.id = 'brevo-script';
  // script.src = `https://sibautomation.com/sa.js?key=${key}`;
  // script.async = true;
  // document.head.appendChild(script);
}

// ─── ConsentManager ───────────────────────────────────────────────────────────

/**
 * Returns the stored consent data, or null if the user has never consented
 * or the cookie is corrupted.
 */
export function getConsents(): ConsentData | null {
  const raw = getCookie(CONSENT_COOKIE);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ConsentData;
    if (
      typeof parsed.version !== 'string' ||
      typeof parsed.date !== 'string' ||
      typeof parsed.marketing !== 'boolean' ||
      typeof parsed.functional !== 'boolean'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Saves the user's consent choices and immediately applies them.
 * This is the main entry point when the user interacts with the cookie banner.
 */
export function saveConsents(choices: ConsentChoices): void {
  const data: ConsentData = {
    version: CONSENT_VERSION,
    date: new Date().toISOString(),
    marketing: choices.marketing,
    functional: choices.functional,
  };

  setCookie(CONSENT_COOKIE, JSON.stringify(data), CONSENT_DURATION_DAYS);
  applyConsentSideEffects(choices);
}

/**
 * Called once on app load (in App.tsx useEffect).
 * Re-applies side effects of previously stored consents — e.g. re-initializes
 * Brevo if the user already accepted marketing cookies in a previous session.
 * Does nothing if no consent has been given yet.
 */
export function initConsents(): void {
  const stored = getConsents();
  if (!stored) return;
  applyConsentSideEffects(stored);
}

/**
 * Returns true if the cookie banner should be shown:
 * - First visit (no consent cookie stored)
 * - Cookie policy version has changed since the user last consented
 */
export function shouldShowBanner(): boolean {
  const stored = getConsents();
  if (!stored) return true;
  return stored.version !== CONSENT_VERSION;
}

/**
 * Withdraws all optional consents immediately (GDPR right to withdraw).
 * Deletes all optional cookies and saves a full-reject consent record.
 */
export function revokeAll(): void {
  deleteCookie(NEWSLETTER_COOKIE);
  deleteCookie(SLOT_PREF_COOKIE);
  saveConsents({ marketing: false, functional: false });
}
