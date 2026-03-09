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

## Products — `/products`

Routes publiques — aucun cookie requis.

### GET /products

Retourne tous les produits disponibles. Filtre optionnel par catégorie.

```bash
# Tous les produits
curl -s http://localhost:3001/api/products | python3 -m json.tool

# Par catégorie (matcha | bubble_tea | tea)
curl -s "http://localhost:3001/api/products?category=matcha" | python3 -m json.tool
curl -s "http://localhost:3001/api/products?category=bubble_tea" | python3 -m json.tool
curl -s "http://localhost:3001/api/products?category=tea" | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + tableau de produits |

---

### GET /products/:id

Retourne le détail d'un produit avec toutes ses options de customisation.

```bash
curl -s http://localhost:3001/api/products/<id> | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + produit complet |
| ID invalide ou produit introuvable | 404 |

---

## Cart — `/cart`

> Toutes les routes requièrent le cookie `auth_token`.
> Le cookie `cart_id` (httpOnly, session) est posé automatiquement à la première requête.

### GET /cart

Retourne le panier de l'utilisateur connecté. Le crée s'il n'existe pas encore.

```bash
curl -s -b /tmp/ommatcha_cookie.txt -c /tmp/ommatcha_cookie.txt \
  http://localhost:3001/api/cart | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + panier avec `items[]` et `totalAmount` |
| Non connecté | 401 |

---

### POST /cart

Ajoute un article au panier. Le prix est snapshoté au moment de l'ajout.

```bash
curl -s -b /tmp/ommatcha_cookie.txt -c /tmp/ommatcha_cookie.txt \
  -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<id>",
    "quantity": 2,
    "customization": {
      "flavour": "vanille",
      "temperature": "chaud",
      "sweetnessLevel": "normal",
      "syrup": "sans sirop",
      "milkType": "lait d'\''avoine"
    }
  }' | python3 -m json.tool
```

Champs : `productId` (requis), `quantity` (optionnel, défaut 1), `customization` (optionnel).

| Cas | Code |
|---|---|
| Succès | 200 + panier mis à jour avec `totalAmount` |
| Produit introuvable | 404 |
| Non connecté | 401 |

---

### DELETE /cart/:itemId

Supprime un article du panier par son `_id` (présent dans `items[]`).

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  -X DELETE http://localhost:3001/api/cart/<itemId> | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + panier mis à jour |
| Article introuvable | 404 |
| Non connecté | 401 |

---

## Créneaux — `/slots`

### GET /slots

Retourne les créneaux disponibles pour aujourd'hui (currentOrders < maxOrders).
Créneaux générés automatiquement au premier appel : 11:00–18:45, intervalles de 15 min (32 créneaux), max 5 commandes chacun.

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  http://localhost:3001/api/slots | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + tableau de créneaux |
| Non connecté | 401 |

---

## Commandes — `/orders`

### POST /orders

Crée une commande en statut `pending` à partir du panier actuel.

Prérequis :
- Être connecté (JWT cookie)
- Avoir une adresse de facturation renseignée (`billingAddress`)
- Panier non vide
- Créneau valide (parmi ceux retournés par GET /slots)

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pickupSlot":"14:00","applyCredit":false}' | python3 -m json.tool
```

Pour utiliser le crédit fidélité (nécessite ≥ 50 points) :
```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pickupSlot":"14:00","applyCredit":true}' | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 201 + commande créée (status: pending) |
| Panier vide | 400 |
| Adresse de facturation manquante | 400 |
| Créneau non disponible | 400 |
| Pas assez de points fidélité | 400 |
| Non connecté | 401 |

---

### PATCH /orders/:id/confirm

Confirme une commande `pending`. Déclenche :
- Passage au statut `confirmed`
- Incrémentation du créneau (currentOrders + 1)
- Crédit des points fidélité (1€ = 1 point)
- Déduction de 50 points si crédit appliqué
- Vidage du panier

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  -X PATCH http://localhost:3001/api/orders/<orderId>/confirm | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + commande confirmée |
| Commande introuvable ou pas la sienne | 404 |
| Commande déjà confirmée/autre statut | 400 |
| Non connecté | 401 |

---

### GET /users/me/orders

Retourne toutes les commandes de l'utilisateur connecté, triées par date décroissante.

```bash
curl -s -b /tmp/ommatcha_cookie.txt \
  http://localhost:3001/api/users/me/orders | python3 -m json.tool
```

| Cas | Code |
|---|---|
| Succès | 200 + tableau de commandes |
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

# 6. Voir les créneaux disponibles
curl -s -b /tmp/ommatcha_cookie.txt http://localhost:3001/api/slots | python3 -m json.tool

# 7. Créer une commande (adapter le créneau selon ce que retourne /slots)
curl -s -b /tmp/ommatcha_cookie.txt \
  -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"pickupSlot":"14:00","applyCredit":false}' | python3 -m json.tool

# 8. Confirmer la commande (remplacer <orderId> par l'_id retourné)
curl -s -b /tmp/ommatcha_cookie.txt \
  -X PATCH http://localhost:3001/api/orders/<orderId>/confirm | python3 -m json.tool

# 9. Voir ses commandes
curl -s -b /tmp/ommatcha_cookie.txt http://localhost:3001/api/users/me/orders | python3 -m json.tool

# 10. Supprimer son compte
curl -s -o /dev/null -w "%{http_code}" \
  -b /tmp/ommatcha_cookie.txt -X DELETE http://localhost:3001/api/users/me
```
