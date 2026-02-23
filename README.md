# 🍵 Oh My Matcha — Site vitrine & commande en ligne

Site web d'une boutique de boissons (matcha, bubble tea, thés) avec commande **sur place et click & collect** — entièrement conforme **RGPD** avec bannière de consentement aux cookies fonctionnelle.

---

## 🛠️ Stack technique

| Couche | Technologie | Pourquoi ce choix |
|---|---|---|
| **Frontend** | React 19 · TypeScript | Composants réutilisables (menu, panier, bannière cookies), typage TypeScript pour fiabiliser les données de commande et les préférences utilisateur |
| **Backend** | NestJS · TypeScript | Architecture modulaire adaptée à un projet structuré (auth, commandes, paiement en modules séparés). Basé sur Express sous le capot, donc léger et familier |
| **Base de données** | MongoDB · Mongoose | NoSQL idéal pour nos documents flexibles : produits avec options variables (laits, tailles, allergènes), commandes imbriquées, profils utilisateur avec points fidélité |
| **Conteneurisation** | Docker · Docker Compose | Environnement identique en dev et sur le serveur scolaire. Un seul `docker-compose up` pour tout lancer — Node.js, MongoDB, Traefik — sans rien installer manuellement |
| **Reverse proxy** | Traefik | Déjà configuré sur le serveur scolaire (`admin_proxy`). Gère le HTTPS automatiquement et route `api.domaine` vers l'API et `domaine` vers le frontend |
| **Paiement** | Stripe Checkout | Aucune donnée bancaire stockée côté serveur. Certification PCI-DSS incluse. Mode test 100% gratuit |

---

## 🐳 Docker — Réutilisation du projet précédent

Le `docker-compose.yml` est adapté du projet scolaire précédent. La structure est identique — trois services, même réseau Traefik `admin_proxy` — seuls les noms, variables d'environnement et la config Stripe ont été mis à jour.

```
ommatcha_app    → React (port 3000)
ommatcha_api    → NestJS (port 3000)
ommatcha_db     → MongoDB 7.0
```

Variables d'environnement à définir dans `.env` :
```bash
DB_USERNAME=
DB_PASSWORD=
DOMAIN_NAME=
JWT_SECRET=
STRIPE_SECRET_KEY=        # sk_test_...
STRIPE_PUBLISHABLE_KEY=   # pk_test_...
STRIPE_WEBHOOK_SECRET=    # whsec_...
DEV=true
```

---

## ✨ Fonctionnalités

- Carte des boissons & site vitrine
- Création de compte + gestion des préférences
- Commande click & collect avec paiement en ligne (Stripe)
- Programme de fidélité & newsletter
- **Bannière cookies CNIL** — consentement granulaire, déclenchement conditionnel des scripts

---

## 🍪 Cookies implémentés

| Cookie | Type | Consentement |
|---|---|---|
| `session_id` · `csrf_token` · `cart_id` · `auth_token` | Technique | ❌ Exempté CNIL |
| `newsletter_consent` | Marketing | ✅ Requis |
| `pickup_slot_pref` | Fonctionnel | ✅ Requis |

---

## ⚖️ Conformité RGPD

- Politique de confidentialité · CGV · Mentions légales
- Droits utilisateurs : accès, rectification, effacement, portabilité
- Mots de passe hashés (bcrypt) · HTTPS via Traefik · Paiement délégué à Stripe (PCI-DSS)
- Durées de conservation définies et appliquées

---
