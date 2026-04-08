# Oh My Matcha — Politique cookies (RGPD/CNIL)

> Document destiné au responsable RGPD du projet.
> Pas de code — tout ce qu'il faut savoir sur les cookies utilisés, pourquoi, et comment le consentement est géré.

---

## Ce qu'est un cookie

Un cookie est un petit fichier texte stocké dans le navigateur de l'utilisateur. Il permet au site de mémoriser des informations entre les pages ou entre les sessions.

La loi française (CNIL) distingue deux types de cookies :
- **Cookies exemptés** — strictement nécessaires au fonctionnement du site. Pas besoin de demander l'autorisation.
- **Cookies soumis à consentement** — utilisés pour des fonctionnalités optionnelles (marketing, personnalisation). L'utilisateur doit explicitement accepter **avant** qu'ils soient déposés.

---

## Les 7 cookies du site

### Catégorie 1 — Cookies techniques (exemptés, toujours actifs)

Ces cookies sont déposés automatiquement dès la visite. Aucun consentement requis car ils sont indispensables au fonctionnement du site.

| Nom du cookie | Durée | Qui le dépose | À quoi il sert |
|---|---|---|---|
| `auth_token` | 1 jour | Serveur (API) | Maintient la session de l'utilisateur connecté. Sans ce cookie, l'utilisateur doit se reconnecter à chaque page. |
| `cart_id` | Session (fermeture du navigateur) | Serveur (API) | Identifie le panier de l'utilisateur. Permet de retrouver les articles même après navigation. |
| `session_id` | Session (fermeture du navigateur) | Serveur (API) | Identifie la session serveur de l'utilisateur. |
| `csrf_token` | Session (fermeture du navigateur) | Navigateur (JS) | Sécurité — protège les formulaires et le paiement contre les attaques CSRF. |

> ⚠️ `auth_token`, `cart_id` et `session_id` sont des cookies **httpOnly** : ils ne sont pas accessibles depuis JavaScript, uniquement par le serveur. Cela les protège contre les attaques XSS.

---

### Catégorie 2 — Cookies marketing (consentement requis)

Déposés **uniquement** si l'utilisateur a coché "Marketing" dans la bannière ou les paramètres.

| Nom du cookie | Durée | Qui le dépose | À quoi il sert |
|---|---|---|---|
| `newsletter_consent` | 14 jours | Navigateur (JS) | Indique que l'utilisateur a consenti au marketing. Déclenche le chargement du script Brevo (outil newsletter) dans le navigateur. Si ce cookie est absent, Brevo n'est **jamais** chargé. |

**Ce qui se passe selon le choix de l'utilisateur :**
- ✅ Marketing accepté → `newsletter_consent` créé (14 jours) → Brevo s'initialise
- ❌ Marketing refusé ou retiré → `newsletter_consent` supprimé immédiatement → Brevo non chargé

---

### Catégorie 3 — Cookies fonctionnels (consentement requis)

Déposés **uniquement** si l'utilisateur a coché "Fonctionnels".

| Nom du cookie | Durée | Qui le dépose | À quoi il sert |
|---|---|---|---|
| `pickup_slot_pref` | 14 jours | Navigateur (JS) | Mémorise le créneau de retrait préféré de l'utilisateur (ex : "14:00"). Confort uniquement — le site fonctionne sans. |

**Ce qui se passe selon le choix de l'utilisateur :**
- ✅ Fonctionnels acceptés → `pickup_slot_pref` peut être créé quand l'utilisateur choisit un créneau
- ❌ Fonctionnels refusés → `pickup_slot_pref` supprimé immédiatement

---

### Cookie de stockage du consentement

Ce cookie n'est pas soumis à consentement — il sert uniquement à mémoriser les choix de l'utilisateur pour ne pas réafficher la bannière à chaque visite.

| Nom du cookie | Durée | Contenu |
|---|---|---|
| `omm_cookie_consent` | 6 mois | `{ version, date, marketing: true/false, functional: true/false }` |

Il enregistre la date du consentement et la version de la politique — si la politique change (nouveaux cookies ajoutés), la bannière réapparaît automatiquement.

---

## Comment fonctionne la bannière de consentement

### Quand elle s'affiche
- À la **première visite** du site
- Quand la **version de la politique cookies change** (ex : on ajoute un nouveau cookie)

### Ce que l'utilisateur peut faire

| Bouton | Effet |
|---|---|
| **Tout accepter** | Marketing ✅ + Fonctionnels ✅ — tous les cookies optionnels sont déposés |
| **Tout refuser** | Marketing ❌ + Fonctionnels ❌ — seuls les cookies techniques sont déposés |
| **Enregistrer mes choix** | L'utilisateur choisit manuellement via les toggles |

> Les deux boutons "Tout accepter" et "Tout refuser" ont le **même poids visuel** (même taille, même style) — exigence CNIL.
> Tous les toggles sont **décochés par défaut** — l'utilisateur doit cocher activement pour accepter.

### Modifier ses choix après coup
L'utilisateur peut changer ses préférences à tout moment via le lien **"Gérer mes cookies"** toujours visible dans le bas de page (footer). Cela ouvre la même interface avec les choix actuels pré-remplis.

---

## Droits de l'utilisateur (RGPD)

| Droit | Comment il est exercé sur le site |
|---|---|
| **Droit de retrait du consentement** | Lien "Gérer mes cookies" dans le footer → "Tout refuser" → cookies optionnels supprimés immédiatement |
| **Droit à l'effacement** | Page Mon compte → "Supprimer mon compte" → toutes les données personnelles supprimées de la base |
| **Droit d'opposition à la newsletter** | Route `DELETE /newsletter/unsubscribe` ou lien de désabonnement dans les emails Brevo |

---

## Ce que le prestataire RGPD doit rédiger

Sur la base de ce document, les textes légaux suivants sont à rédiger :

1. **Politique de confidentialité** (`/privacy`) — comment les données personnelles sont collectées, utilisées, conservées
2. **Politique cookies** (`/cookies`) — reprend et détaille ce document dans un langage accessible au grand public
3. **CGV** (`/terms`) — conditions générales de vente (click & collect)
4. **Mentions légales** (`/legal`) — éditeur, hébergeur, directeur de publication

> Ces 4 pages existent déjà dans le site (routes créées) mais leur contenu textuel est à remplir.

---

## Durées de conservation des données en base

| Donnée | Durée | Justification |
|---|---|---|
| Compte utilisateur | Jusqu'à suppression par l'utilisateur | Droit à l'effacement |
| Historique des commandes | Durée de conservation du compte | Obligation légale commerciale |
| Date de consentement newsletter (`consentDate`) | Conservée même après désabonnement | Preuve de consentement RGPD |
| Abonnement newsletter inactif | Conservé avec `active: false` | Piste d'audit RGPD |

---

## Contact CNIL

En cas de question sur la conformité : [cnil.fr](https://www.cnil.fr) — la CNIL met à disposition des outils de vérification gratuits pour les sites web.
