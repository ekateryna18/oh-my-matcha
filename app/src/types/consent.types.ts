/**
 * The choices the user makes in the cookie banner.
 * Only covers optional cookies — technical cookies are always active.
 */
export interface ConsentChoices {
  /** Controls: newsletter_consent cookie + Brevo initialization */
  marketing: boolean;
  /** Controls: pickup_slot_pref cookie */
  functional: boolean;
}

/**
 * What is stored in the omm_cookie_consent cookie.
 * Includes metadata needed for versioning and GDPR audit.
 */
export interface ConsentData extends ConsentChoices {
  /** Version of the cookie policy — bump CONSENT_VERSION to re-ask users */
  version: string;
  /** ISO date string — when the user gave consent */
  date: string;
}
