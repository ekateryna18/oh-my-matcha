# Oh My Matcha — Guide de test Postman

Base URL : `http://localhost:3001/api`

---

## Configuration initiale

### 1. Activer la gestion des cookies
Postman gère automatiquement les cookies httpOnly (auth_token, cart_id).
Vérifie que la case **"Automatically follow redirects"** est cochée dans les paramètres.

### 2. Header à ajouter sur toutes les requêtes avec body
| Key | Value |
|---|---|
| `Content-Type` | `application/json` |

### 3. Variable d'environnement recommandée
Crée un environnement Postman avec :
| Variable | Value |
|---|---|
| `BASE_URL` | `http://localhost:3001/api` |
| `USER_ID` | *(à remplir après login)* |
| `ORDER_ID` | *(à remplir après création de commande)* |
| `ITEM_ID` | *(à remplir après ajout au panier)* |

---

## Health

### GET /health
Vérifie que l'API tourne.

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/health` |
| **Auth** | Aucune |
| **Body** | Aucun |

**Réponse attendue : 200**
```json
{ "status": "ok", "project": "Oh My Matcha API", "timestamp": "..." }
```

---

## Auth

### POST /auth/register
Crée un nouveau compte.

| Champ | Valeur |
|---|---|
| **Méthode** | POST |
| **URL** | `{{BASE_URL}}/auth/register` |
| **Auth** | Aucune |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) :**
```json
{
  "email": "test@ommatcha.fr",
  "password": "motdepasse123",
  "firstName": "Test",
  "lastName": "User",
  "phoneNumber": "0600000000",
  "dateOfBirth": "2000-01-01",
  "cookieConsents": {
    "marketing": false,
    "functional": true,
    "version": "1.0"
  }
}
```

**Réponse attendue : 201** — objet utilisateur (sans passwordHash)

---

### POST /auth/login
Connecte l'utilisateur. **Postman stocke automatiquement le cookie `auth_token`.**

| Champ | Valeur |
|---|---|
| **Méthode** | POST |
| **URL** | `{{BASE_URL}}/auth/login` |
| **Auth** | Aucune |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) :**
```json
{
  "email": "test@ommatcha.fr",
  "password": "motdepasse123"
}
```

**Réponse attendue : 200** — objet utilisateur

> ⚠️ Après cette requête, le cookie `auth_token` est automatiquement envoyé sur toutes les requêtes suivantes vers `localhost:3001`.

---

## Users

> Toutes ces routes nécessitent d'être connecté (cookie `auth_token` présent).

### GET /users/me

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/users/me` |
| **Auth** | Cookie `auth_token` (automatique) |

**Réponse attendue : 200** — profil complet de l'utilisateur

---

### PATCH /users/me
Met à jour les informations personnelles.

| Champ | Valeur |
|---|---|
| **Méthode** | PATCH |
| **URL** | `{{BASE_URL}}/users/me` |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) — tous les champs sont optionnels :**
```json
{
  "firstName": "Nouveau Prénom",
  "billingAddress": {
    "street": "1 rue du Matcha",
    "city": "Paris",
    "zip": "75001"
  }
}
```

**Réponse attendue : 200** — profil mis à jour

---

### PATCH /users/me/consents
Met à jour les préférences de cookies.

| Champ | Valeur |
|---|---|
| **Méthode** | PATCH |
| **URL** | `{{BASE_URL}}/users/me/consents` |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) :**
```json
{
  "marketing": true,
  "functional": true,
  "version": "1.1"
}
```

**Réponse attendue : 200** — profil mis à jour avec nouvelle date de consentement

---

### GET /users/me/loyalty
Solde de points fidélité et historique.

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/users/me/loyalty` |

**Réponse attendue : 200**
```json
{
  "loyaltyPoints": 21,
  "loyaltyHistory": [
    { "date": "...", "amount": 16, "reason": "Commande OMM-2026-0001", "orderId": "..." },
    { "date": "...", "amount": 5, "reason": "Bonus inscription newsletter" }
  ]
}
```

---

### GET /users/me/orders
Historique des commandes, triées par date décroissante.

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/users/me/orders` |

**Réponse attendue : 200** — tableau de commandes

---

### DELETE /users/me
Supprime le compte (droit à l'effacement RGPD). Efface aussi le cookie `auth_token`.

| Champ | Valeur |
|---|---|
| **Méthode** | DELETE |
| **URL** | `{{BASE_URL}}/users/me` |

**Réponse attendue : 204** — pas de body

---

## Products

> Routes publiques — pas besoin d'être connecté.

### GET /products
Tous les produits disponibles.

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/products` |
| **Auth** | Aucune |

**Réponse attendue : 200** — tableau de produits

---

### GET /products?category=matcha
Produits filtrés par catégorie.

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/products?category=matcha` |
| **Auth** | Aucune |

**Valeurs possibles pour `category` :** `matcha` · `bubble_tea` · `tea`

**Réponse attendue : 200** — tableau filtré

---

### GET /products/:id
Un seul produit avec toutes ses options de personnalisation.

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/products/<id>` |
| **Auth** | Aucune |

> Remplace `<id>` par un `_id` récupéré depuis GET /products.

**Réponse attendue : 200** — produit complet
**Erreurs :** 404 si introuvable, 400 si l'id n'est pas un ObjectId valide

---

## Cart

> Routes protégées. Le cookie `cart_id` est géré automatiquement par Postman.

### GET /cart

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/cart` |

**Réponse attendue : 200** — panier avec ses articles

---

### POST /cart
Ajoute un article au panier.

| Champ | Valeur |
|---|---|
| **Méthode** | POST |
| **URL** | `{{BASE_URL}}/cart` |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) :**
```json
{
  "productId": "<id_du_produit>",
  "quantity": 2,
  "customization": {
    "temperature": "chaud",
    "sweetnessLevel": "peu sucré",
    "milkType": "lait d'avoine"
  }
}
```

> `quantity` et `customization` sont optionnels (défaut : quantity = 1).

**Réponse attendue : 200** — panier mis à jour
**Erreurs :** 404 produit introuvable, 400 produit indisponible

---

### DELETE /cart/:itemId
Supprime un article du panier.

| Champ | Valeur |
|---|---|
| **Méthode** | DELETE |
| **URL** | `{{BASE_URL}}/cart/<itemId>` |

> `itemId` = le champ `_id` d'un élément dans `items[]`, récupéré via GET /cart.

**Réponse attendue : 200** — panier mis à jour
**Erreurs :** 404 article introuvable

---

## Slots

### GET /slots
Créneaux disponibles pour aujourd'hui (11:00–18:45, intervalles de 15 min).

| Champ | Valeur |
|---|---|
| **Méthode** | GET |
| **URL** | `{{BASE_URL}}/slots` |

**Réponse attendue : 200** — tableau de créneaux disponibles (currentOrders < maxOrders)

> Note : les créneaux sont générés automatiquement au premier appel du jour.

---

## Orders

### POST /orders
Crée une commande depuis le panier actuel.

| Champ | Valeur |
|---|---|
| **Méthode** | POST |
| **URL** | `{{BASE_URL}}/orders` |
| **Header** | `Content-Type: application/json` |

**Prérequis :**
- Être connecté
- Avoir une `billingAddress` renseignée (via PATCH /users/me)
- Panier non vide
- Créneau valide (récupéré depuis GET /slots)

**Body (raw JSON) :**
```json
{
  "pickupSlot": "14:00",
  "applyCredit": false
}
```

Pour utiliser les 5€ de crédit fidélité (nécessite ≥ 50 points) :
```json
{
  "pickupSlot": "14:00",
  "applyCredit": true
}
```

**Réponse attendue : 201** — commande créée avec `status: "pending"`

> Copie le champ `_id` de la réponse → variable `ORDER_ID`.

**Erreurs :**
| Cas | Code |
|---|---|
| Panier vide | 400 |
| Adresse de facturation manquante | 400 |
| Créneau non disponible | 400 |
| Pas assez de points pour le crédit | 400 |

---

### PATCH /orders/:id/confirm
Confirme la commande. Crédite les points fidélité et vide le panier.

| Champ | Valeur |
|---|---|
| **Méthode** | PATCH |
| **URL** | `{{BASE_URL}}/orders/{{ORDER_ID}}/confirm` |
| **Body** | Aucun |

**Réponse attendue : 200** — commande avec `status: "confirmed"`

**Erreurs :**
| Cas | Code |
|---|---|
| Commande introuvable ou pas la sienne | 404 |
| Commande déjà confirmée | 400 |

---

## Newsletter

> Routes publiques — pas besoin d'être connecté.
> Si le cookie `auth_token` est présent, +5 pts fidélité sont crédités (une seule fois).

### POST /newsletter/subscribe

| Champ | Valeur |
|---|---|
| **Méthode** | POST |
| **URL** | `{{BASE_URL}}/newsletter/subscribe` |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) :**
```json
{
  "email": "test@ommatcha.fr"
}
```

**Réponse attendue : 201** — document d'abonnement

**Erreurs :**
| Cas | Code |
|---|---|
| Email déjà actif | 400 |

---

### DELETE /newsletter/unsubscribe

| Champ | Valeur |
|---|---|
| **Méthode** | DELETE |
| **URL** | `{{BASE_URL}}/newsletter/unsubscribe` |
| **Header** | `Content-Type: application/json` |

**Body (raw JSON) :**
```json
{
  "email": "test@ommatcha.fr"
}
```

**Réponse attendue : 204** — pas de body

**Erreurs :**
| Cas | Code |
|---|---|
| Email introuvable ou déjà désabonné | 404 |

---

## Séquence de test complète (dans l'ordre)

1. `GET /health` → vérifier que l'API répond
2. `POST /auth/register` → créer un compte
3. `POST /auth/login` → se connecter (cookie auto)
4. `GET /users/me` → vérifier le profil
5. `PATCH /users/me` → ajouter une adresse de facturation
6. `GET /products` → récupérer un `productId`
7. `POST /cart` → ajouter un article (copier `_id` de l'item → `ITEM_ID`)
8. `GET /cart` → vérifier le panier
9. `DELETE /cart/{{ITEM_ID}}` → supprimer l'article *(optionnel)*
10. `POST /cart` → remettre un article
11. `GET /slots` → récupérer un créneau disponible
12. `POST /orders` → créer une commande (copier `_id` → `ORDER_ID`)
13. `PATCH /orders/{{ORDER_ID}}/confirm` → confirmer la commande
14. `GET /users/me/orders` → voir l'historique
15. `GET /users/me/loyalty` → vérifier les points crédités
16. `POST /newsletter/subscribe` → s'inscrire (connecté → +5 pts)
17. `GET /users/me/loyalty` → vérifier les +5 pts
18. `DELETE /newsletter/unsubscribe` → se désabonner
19. `PATCH /users/me/consents` → mettre à jour les consentements
20. `DELETE /users/me` → supprimer le compte
