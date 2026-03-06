# Week 1 — Résumé technique

## Objectif
Mise en place de la base du projet et du système d'authentification (partie 1).

---

## Séance 1 — Infrastructure & base

### Docker Compose
- 3 conteneurs : `ommatcha_api` (NestJS), `ommatcha_app` (React), `ommatcha_db` (MongoDB 7)
- Réseau interne `ommatcha_network`
- Variables d'environnement via `.env`

### NestJS — structure initiale
- `main.ts` : `ValidationPipe({ whitelist: true })`, `cookieParser()`, CORS vers `localhost:5173`, préfixe global `/api`
- `AppModule` : `ConfigModule` global, `MongooseModule.forRootAsync` (connexion MongoDB via env)
- `HealthController` : `GET /api/health` pour vérifier que l'API répond

### Mongoose — schémas
**User** (`api/src/users/schemas/user.schema.ts`)
- Champs : `email`, `passwordHash`, `firstName`, `lastName`, `phoneNumber`, `dateOfBirth`, `billingAddress?`, `loyaltyPoints`, `loyaltyHistory[]`, `newsletterSubscribed`, `newsletterConsentDate?`, `cookieConsents`
- `toJSON` transform : supprime `passwordHash` de toutes les réponses API
- Sous-schémas imbriqués : `BillingAddress`, `LoyaltyHistoryEntry`, `CookieConsents`

**Product** (`api/src/products/schemas/product.schema.ts`)
- Schéma produit avec `timestamps: true`

### Seed script
- `api/src/seeds/seed-products.ts` : insère 9 produits de démonstration en base
- Script npm : `seed:products`

---

## Séance 2 — Auth : POST /auth/register + GET /users/me

### Nouveaux fichiers créés

| Fichier | Rôle |
|---|---|
| `api/src/auth/dto/register.dto.ts` | Validation de la requête d'inscription (class-validator) |
| `api/src/users/users.service.ts` | `create`, `findById`, `findByEmail` |
| `api/src/users/users.controller.ts` | `GET /users/me` protégé par `JwtAuthGuard` |
| `api/src/auth/strategies/jwt.strategy.ts` | Extrait le JWT du cookie httpOnly `auth_token` |
| `api/src/auth/guards/jwt-auth.guard.ts` | `AuthGuard('jwt')` — garde NestJS standard |
| `api/src/auth/auth.service.ts` | Logique d'inscription : conflit email → hash bcrypt → création |
| `api/src/auth/auth.controller.ts` | `POST /auth/register` → 201 + utilisateur créé |
| `api/src/auth/auth.module.ts` | Câblage `UsersModule`, `PassportModule`, `JwtModule` |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `api/src/users/users.module.ts` | Ajout `UsersService` (provider + export), `UsersController` |
| `api/src/app.module.ts` | Ajout `AuthModule` dans les imports |

### Règles de sécurité respectées
- `passwordHash` jamais retourné (supprimé par le `toJSON` transform du schéma)
- JWT extrait uniquement depuis le cookie httpOnly `auth_token` — jamais depuis un header
- bcrypt 10 rounds
- `cookieConsents.date` défini côté serveur, non fourni par le client
- L'inscription ne délivre pas de token (ce sera le login, semaine suivante)
- `ConflictException` si l'email est déjà utilisé (message en français)

### Comportement vérifié
```
POST /api/auth/register  → 201 + objet utilisateur (sans passwordHash)
POST /api/auth/register  → 409 si email déjà existant
GET  /api/users/me       → 401 (attendu — login pas encore implémenté)
```
