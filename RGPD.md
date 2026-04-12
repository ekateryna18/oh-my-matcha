# Rapport RGPD — Oh My Matcha

> Projet scolaire — Application Click & Collect de salon de thé
> Stack : React 19 · NestJS 11 · MongoDB 7 · Docker
> Date : avril 2026

---

## 1. Données personnelles collectées

### 1.1 Lors de l'inscription (`POST /auth/register`)

| Champ | Obligatoire | Utilisation | Stockage |
|---|---|---|---|
| `email` | ✅ | Identifiant unique de connexion | MongoDB, normalisé en minuscules |
| `password` | ✅ | Authentification | **Jamais stocké** — hashé via `bcrypt` (10 rounds) avant insertion |
| `firstName` | ✅ | Personnalisation de l'interface | MongoDB |
| `lastName` | ✅ | Identification | MongoDB |
| `phoneNumber` | ✅ | Contact en cas de problème commande | MongoDB |
| `dateOfBirth` | ✅ | Vérification de l'âge | MongoDB |
| `cookieConsents` | ✅ | Preuve du consentement RGPD | MongoDB (avec date + version) |
| `newsletterSubscribed` | ❌ | Opt-in newsletter (case à cocher) | MongoDB |

> **Point important :** le mot de passe n'est **jamais** stocké en clair. `bcrypt` avec 10 rounds de salage est utilisé. De plus, le champ `passwordHash` est exclu de **toutes** les réponses API via un transform `toJSON` sur le schéma Mongoose — il est donc impossible de le récupérer via l'API, même en tant qu'administrateur.

### 1.2 Lors de la première commande

| Champ | Utilisation |
|---|---|
| `billingAddress` (rue, ville, code postal) | Facturation — renseignée sur la page paiement, sauvegardée sur le profil |

> L'adresse de facturation n'est **pas requise à l'inscription** (principe de minimisation des données).

### 1.3 Données générées automatiquement

| Donnée | Générée quand | Conservée |
|---|---|---|
| `loyaltyPoints` | À chaque commande confirmée (1€ = 1 pt) | Jusqu'à suppression du compte |
| `loyaltyHistory` | À chaque gain/utilisation de points | Jusqu'à suppression du compte |
| `newsletterConsentDate` | À l'inscription à la newsletter | Jusqu'à suppression du compte (preuve de consentement RGPD) |
| `createdAt` / `updatedAt` | Automatiquement par Mongoose | Jusqu'à suppression du compte |

### 1.4 Données des commandes (collection `orders`)

Chaque commande enregistre : liste des produits commandés, créneau de retrait, montant total, crédit fidélité utilisé, points gagnés, statut.

---

## 2. Cookies utilisés

Le projet implémente un modèle à **6 cookies**, répartis en 3 catégories.

### 2.1 Tableau complet des cookies

| Nom | Catégorie | Durée | httpOnly | Accessible en JS | Finalité |
|---|---|---|---|---|---|
| `omm_cookie_consent` | Technique (essentiel) | 6 mois | ❌ | ✅ | Stocke les choix de consentement de l'utilisateur (JSON : marketing, functional, date, version) |
| `auth_token` | Technique (essentiel) | 1 jour | ✅ | ❌ | JWT d'authentification — défini et lu uniquement par le serveur NestJS |
| `cart_id` | Technique (essentiel) | Session | ✅ | ❌ | Identifiant du panier — httpOnly, invisible en JS |
| `session_id` | — | — | — | — | ~~Prévu dans les specs initiales~~ — non implémenté. L'architecture JWT stateless le rend inutile. |
| `newsletter_consent` | Marketing (optionnel) | 14 jours | ❌ | ✅ | Activé uniquement si l'utilisateur accepte les cookies marketing — déclenche l'initialisation de Brevo |
| `pickup_slot_pref` | Fonctionnel (optionnel) | 14 jours | ❌ | ✅ | Mémorise le créneau de retrait préféré pour pré-remplir le sélecteur au prochain passage |

### 2.2 Où chaque cookie est défini dans le code

#### `omm_cookie_consent`
- **Fichier :** `app/src/lib/ConsentManager.ts` — fonction `saveConsents()`
- **Quand :** lorsque l'utilisateur clique sur "Tout accepter", "Refuser" ou "Enregistrer mes choix" dans la bannière ou la page compte
- **Contenu :** `{ version, date, marketing: bool, functional: bool }` — sérialisé en JSON puis encodé URI

#### `auth_token`
- **Fichier :** `api/src/auth/auth.controller.ts` — endpoint `POST /auth/login`
- **Quand :** à chaque connexion réussie
- **Flags :** `httpOnly: true`, `sameSite: 'lax'`, `secure: true` en production
- **Durée :** 24 heures (`maxAge: ONE_DAY_MS`)

#### `newsletter_consent`
- **Fichier :** `app/src/lib/ConsentManager.ts` — fonction `applyConsentSideEffects()`
- **Quand :** uniquement si `choices.marketing === true`
- **Supprimé quand :** l'utilisateur retire son consentement marketing (ConsentManager, AccountPage — NewsletterPrefs, `revokeAll()`)

#### `pickup_slot_pref`
- **Fichier :** `app/src/pages/Cart.tsx` — fonction `handleSlotChange()`
- **Quand :** uniquement si `consents.functional === true` et que l'utilisateur choisit un créneau dans le panier
- **Supprimé quand :** l'utilisateur retire son consentement fonctionnel

#### `cart_id`
- Géré exclusivement côté serveur (NestJS) — le frontend ne le lit et ne l'écrit jamais.

> **Note :** `session_id` et `csrf_token` étaient prévus dans les specs initiales mais ne sont pas implémentés. L'architecture JWT avec `sameSite: 'lax'` remplace `session_id` (authentification stateless) et assure une protection CSRF équivalente.

---

## 3. Mécanisme de consentement

### 3.1 Bannière cookies (`CookieBanner`)

La bannière apparaît **automatiquement** dans deux cas :
1. Première visite (aucun cookie `omm_cookie_consent` présent)
2. La version de la politique cookies a changé depuis le dernier consentement (champ `version` dans le cookie comparé à la constante `CONSENT_VERSION` dans `ConsentManager.ts`)

L'utilisateur a trois choix :
- **Tout accepter** → `{ marketing: true, functional: true }`
- **Refuser** → `{ marketing: false, functional: false }`
- **Personnaliser** → ouvre `CookieSettings` pour un choix granulaire

### 3.2 Granularité du consentement

L'interface `CookieSettings` (accessible via la bannière ou "Gérer mes cookies" dans le footer) permet de choisir **séparément** :
- Cookies marketing (newsletter Brevo)
- Cookies fonctionnels (mémorisation du créneau)

Les cookies **techniques/essentiels** ne sont pas soumis au consentement (conformément à la directive ePrivacy) et ne sont pas présentés comme optionnels.

### 3.3 Retrait du consentement

L'utilisateur peut retirer son consentement à tout moment depuis deux endroits :
- **Footer → "Gérer mes cookies"** → `CookieSettings` → `revokeAll()`
- **Mon Compte → Préférences cookies** → modification individuelle

À la révocation, `revokeAll()` dans `ConsentManager.ts` :
1. Supprime immédiatement `newsletter_consent` (`deleteCookie`)
2. Supprime immédiatement `pickup_slot_pref` (`deleteCookie`)
3. Enregistre un nouveau consentement `{ marketing: false, functional: false }` avec la date courante

### 3.4 Preuve de consentement

Le consentement est enregistré à **deux endroits** :
- **Navigateur** : cookie `omm_cookie_consent` (JSON avec date ISO et version)
- **Base de données** : champ `cookieConsents` sur le document `User` (date + version stockées en MongoDB)

---

## 4. Droits des utilisateurs implémentés

| Droit RGPD (Art.) | Implémentation |
|---|---|
| **Droit d'accès** (Art. 15) | `GET /users/me` — retourne toutes les données du profil (sauf `passwordHash`) |
| **Droit de rectification** (Art. 16) | `PATCH /users/me` — modification de prénom, nom, téléphone, date de naissance, adresse |
| **Droit à l'effacement** (Art. 17) | `DELETE /users/me` → `findByIdAndDelete()` — suppression immédiate et irréversible du document MongoDB |
| **Droit au retrait du consentement** (Art. 7) | `revokeAll()` dans `ConsentManager.ts` + section Préférences cookies dans le compte |
| **Droit de s'opposer** (newsletter) | `DELETE /newsletter/unsubscribe` — enregistre la date de désinscription + supprime le cookie `newsletter_consent` |

### Suppression du compte — flux complet

```
Utilisateur clique "Oui, supprimer définitivement"
  → DELETE /users/me (API)
    → UsersService.deleteById() → findByIdAndDelete()
      → Supprime le document User de MongoDB
  → logout() côté client (vide le contexte Auth)
  → Redirection vers /
```

> **Limite actuelle :** la collection `orders` (commandes passées) n'est pas supprimée en cascade lors de la suppression du compte. Dans un contexte réel, il faudrait soit supprimer les commandes, soit les anonymiser.

---

## 5. Durées de conservation des données

| Donnée | Durée de conservation | Déclencheur de suppression |
|---|---|---|
| Données profil utilisateur | Jusqu'à suppression du compte | Action utilisateur (Zone de danger) |
| Commandes | Indéfinie (pas de purge automatique) | Non implémenté — à prévoir |
| Abonnement newsletter | Indéfinie (soft delete — `active: false`) | L'entrée reste avec `unsubscribeDate` |
| `auth_token` (cookie) | 1 jour | Expiration automatique ou déconnexion |
| `omm_cookie_consent` (cookie) | 6 mois | Expiration automatique |
| `newsletter_consent` (cookie) | 14 jours | Expiration ou retrait du consentement |
| `pickup_slot_pref` (cookie) | 14 jours | Expiration ou retrait du consentement fonctionnel |

---

## 6. Sécurité des données

### 6.1 Mots de passe
- Hashage `bcrypt` avec **10 rounds de salage**
- Le `passwordHash` n'est jamais retourné par l'API (transform `toJSON` sur le schéma Mongoose)

### 6.2 JWT et cookies d'authentification
- `auth_token` : flag `httpOnly` → inaccessible depuis JavaScript (protection XSS)
- `auth_token` : flag `secure` activé en production (HTTPS uniquement)
- `auth_token` : flag `sameSite: 'lax'` (protection CSRF partielle)

### 6.3 Secrets
- `JWT_SECRET` et `DB_PASSWORD` stockés dans le fichier `.env`, non versionné (`.gitignore`)
- Aucun secret hardcodé dans le code source

### 6.4 Transmission des données
- En développement : HTTP
- En production (avec Traefik) : HTTPS via TLS — flag `secure` du cookie activé automatiquement quand `NODE_ENV=production`

---

## 7. Newsletter — flux RGPD

```
Inscription newsletter (opt-in)
  → POST /newsletter/subscribe { email }
    → Enregistrement en DB : { email, consentDate, active: true }
    → Si utilisateur connecté : +5 points de fidélité (une seule fois)
    → updateConsents({ marketing: true }) côté client
      → setCookie('newsletter_consent', 'true', 14 jours)
      → initBrevo() (si VITE_BREVO_CLIENT_KEY configuré)
    → Mise à jour newsletterSubscribed: true sur le profil

Désinscription newsletter (droit d'opposition)
  → DELETE /newsletter/unsubscribe { email }
    → Mise à jour en DB : { active: false, unsubscribeDate: now }
  → updateConsents({ marketing: false }) côté client
    → deleteCookie('newsletter_consent')
    → Brevo non rechargé au prochain démarrage
  → Mise à jour newsletterSubscribed: false sur le profil
```

> La `consentDate` est enregistrée en base pour chaque inscription — preuve de consentement exigée par l'Art. 7 RGPD.

---

## 8. Pages légales implémentées

| URL | Page | Contenu |
|---|---|---|
| `/privacy` | Politique de confidentialité | Données collectées, base légale, durées de conservation, droits, contact DPO |
| `/cookies` | Politique de cookies | Tableau des 6 cookies, finalités, durées, comment les gérer |
| `/legal` | Mentions légales | Éditeur, hébergeur, propriété intellectuelle |
| `/terms` | CGV + CGU | Conditions de vente (Art. 1–10) + Conditions d'utilisation (Art. 11–16) |

Toutes accessibles depuis le **footer** sur chaque page du site, conformément aux exigences CNIL.

Le bouton **"Gérer mes cookies"** est également toujours présent dans le footer (exigence CNIL — l'utilisateur doit pouvoir modifier ses choix à tout moment).

---

## 9. Ce qui reste à améliorer (en contexte réel)

| Point | Description |
|---|---|
| Suppression en cascade | Lors de la suppression d'un compte, anonymiser ou supprimer les commandes associées |
| Purge automatique | Mettre en place un job de purge des données inactives après une durée définie (ex. 3 ans sans connexion) |
| Export des données | Implémenter `GET /users/me/export` (droit à la portabilité, Art. 20 RGPD) — retourner un JSON ou CSV de toutes les données |
| Brevo réel | Configurer `VITE_BREVO_CLIENT_KEY` pour synchroniser les désinscriptions avec la liste Brevo via leur API |
| HTTPS obligatoire | En production, forcer la redirection HTTP → HTTPS au niveau Traefik |
| Journalisation | Conserver un log des actions sensibles (suppression de compte, modifications des consentements) |
| DPO | Désigner un délégué à la protection des données si le volume de données le justifie |
