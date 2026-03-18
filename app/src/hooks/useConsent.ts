import { useCallback, useState } from 'react';
import { getConsents, saveConsents } from '../lib/ConsentManager';
import type { ConsentChoices, ConsentData } from '../types/consent.types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

/**
 * useConsent — access and update cookie consents from any component.
 *
 * Usage:
 *   const { consents, updateConsents } = useConsent();
 *
 *   // Read current state
 *   consents?.marketing  // true | false | undefined (not yet set)
 *
 *   // Update from the cookie banner or settings page
 *   await updateConsents({ marketing: true, functional: false });
 */
export function useConsent() {
  const [consents, setConsents] = useState<ConsentData | null>(() => getConsents());

  /**
   * Saves the new choices, applies side effects, refreshes local state,
   * and silently syncs with the backend if the user is logged in.
   *
   * The backend sync is best-effort — 401 (not logged in) and network
   * errors are silently ignored so guests can also accept cookies.
   */
  const updateConsents = useCallback(async (choices: ConsentChoices): Promise<void> => {
    saveConsents(choices);
    setConsents(getConsents());

    // Sync with backend — only succeeds if auth_token cookie is present
    try {
      await fetch(`${API_URL}/users/me/consents`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends auth_token httpOnly cookie automatically
        body: JSON.stringify({
          marketing: choices.marketing,
          functional: choices.functional,
          version: '1.0',
        }),
      });
    } catch {
      // Network error or not logged in — ignore
    }
  }, []);

  return { consents, updateConsents };
}
