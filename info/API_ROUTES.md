# API Routes — Oh My Matcha

Base URL: `http://localhost:3001/api`

---

## Démarrage

```bash
# Lancer tous les conteneurs (api + app + mongodb)
docker compose up -d

# Voir les logs de l'API en temps réel
docker logs -f ommatcha_api

# Arrêter les conteneurs
docker compose down

# Rebuild complet (après changement de Dockerfile ou package.json)
docker compose up -d --build
```

L'API est prête quand les logs affichent :
```
🍵 Oh My Matcha API running on http://localhost:3001/api
```

---

## Health

### GET /health

```bash
curl -s http://localhost:3001/api/health | python3 -m json.tool
```

Réponse attendue :
```json
{ "status": "ok", "project": "Oh My Matcha API", "timestamp": "..." }
```

---

## Auth — `/auth`

### POST /auth/register

Crée un compte. Ne retourne pas de token.

```bash
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@ommatcha.fr",
    "password": "motdepasse123",
    "firstName": "Alice",
    "lastName": "Dupont",
    "phoneNumber": "0612345678",
    "dateOfBirth": "1995-06-15",
    "newsletterSubscribed": false,
    "cookieConsents": {
      "marketing": false,
      "functional": true,
      "version": "1.0"
    }
  }' | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 201 + user (sans passwordHash) |
| Email déjà utilisé | 409 |
| Champs invalides | 400 |

---

### POST /auth/login

Authentifie l'utilisateur. Pose le cookie `auth_token` (httpOnly, 1 jour).

```bash
curl -s -c /tmp/ommatcha_cookie.txt \
  -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@ommatcha.fr",
    "password": "motdepasse123"
  }' | python3 -m json.tool
```

> Le cookie est sauvegardé dans `/tmp/ommatcha_cookie.txt` pour les requêtes suivantes.

| Cas | Code |
|---|---|
| Succès | 200 + user + cookie posé |
| Email inconnu ou mauvais mot de passe | 401 |

---

## Users — `/users`

> Toutes les routes ci-dessous requièrent le cookie `auth_token`.
> Utiliser `-b /tmp/ommatcha_cookie.txt` pour l'envoyer.

### GET /users/me

Retourne le profil de l'utilisateur connecté.

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  http://localhost:3001/api/users/me | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + user |
| Non connecté | 401 |

---

### PATCH /users/me

Met à jour les informations personnelles. Tous les champs sont optionnels.

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  -X PATCH http://localhost:3001/api/users/me \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Martin",
    "phoneNumber": "0699887766",
    "dateOfBirth": "1995-06-15",
    "newsletterSubscribed": true,
    "billingAddress": {
      "street": "12 rue du Thé",
      "city": "Lyon",
      "zip": "69001"
    }
  }' | python3 -m json.tool
```

Champs modifiables : `firstName`, `lastName`, `phoneNumber`, `dateOfBirth`, `newsletterSubscribed`, `billingAddress`.

> Si `newsletterSubscribed` passe de `false` à `true`, `newsletterConsentDate` est défini côté serveur.

| Cas | Code |
|---|---|
| Succès | 200 + user mis à jour |
| Non connecté | 401 |

---

### PATCH /users/me/consents

Met à jour les consentements cookies. La `date` est toujours définie côté serveur.

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  -X PATCH http://localhost:3001/api/users/me/consents \
  -H "Content-Type: application/json" \
  -d '{
    "marketing": true,
    "functional": true,
    "version": "1.1"
  }' | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + user avec nouveaux consentements |
| Non connecté | 401 |

---

### DELETE /users/me

Supprime le compte (droit à l'effacement RGPD). Efface le cookie `auth_token`.

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -b /tmp/ommatcha_cookie.txt \
  -X DELETE http://localhost:3001/api/users/me
```

| Cas | Code |
|---|---|
| Succès | 204 (no content) |
| Non connecté | 401 |

---

## Séquence de test complète

```bash
# 1. Créer un compte
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ommatcha.fr","password":"motdepasse123","firstName":"Test","lastName":"User","phoneNumber":"0600000000","dateOfBirth":"2000-01-01","cookieConsents":{"marketing":false,"functional":true,"version":"1.0"}}' \
  | python3 -m json.tool

# 2. Se connecter (sauvegarde le cookie)
curl -s -c /tmp/ommatcha_cookie.txt \
  -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ommatcha.fr","password":"motdepasse123"}' \
  | python3 -m json.tool

# 3. Consulter son profil
curl -s -b /tmp/ommatcha_cookie.txt http://localhost:3001/api/users/me | python3 -m json.tool

# 4. Modifier son profil
curl -s -b /tmp/ommatcha_cookie.txt -X PATCH http://localhost:3001/api/users/me \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Nouveau","billingAddress":{"street":"1 rue du Matcha","city":"Paris","zip":"75001"}}' \
  | python3 -m json.tool

# 5. Mettre à jour les consentements
curl -s -b /tmp/ommatcha_cookie.txt -X PATCH http://localhost:3001/api/users/me/consents \
  -H "Content-Type: application/json" \
  -d '{"marketing":true,"functional":true,"version":"1.1"}' \
  | python3 -m json.tool

# 6. Supprimer son compte
curl -s -o /dev/null -w "%{http_code}" \
  -b /tmp/ommatcha_cookie.txt -X DELETE http://localhost:3001/api/users/me
```
