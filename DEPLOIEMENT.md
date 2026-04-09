# Guide de déploiement — Oh My Matcha

> Projet étudiant — React 19 + NestJS 11 + MongoDB 7 + Docker Compose
> Dernière mise à jour : avril 2026

---

## Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Docker Engine | 24+ | `docker --version` |
| Docker Compose plugin | 2.20+ | `docker compose version` |
| Git | — | `git --version` |
| `openssl` | — | `openssl version` |

> Traefik : si votre serveur utilise déjà Traefik, consultez la section dédiée en bas de ce document.

---

## 1. Cloner le dépôt

```bash
git clone <url-du-repo> oh-my-matcha
cd oh-my-matcha
```

---

## 2. Créer le fichier `.env`

Le fichier `.env` **n'est pas versionné** (sécurité). Un modèle est fourni :

```bash
cp .env.example .env
```

Ouvrez ensuite `.env` et renseignez les valeurs :

```env
# MongoDB
DB_USERNAME=ohmymatcha
DB_PASSWORD=<mot_de_passe_fort>
DB_NAME=oh_my_matcha

# JWT — générer avec : openssl rand -hex 32
JWT_SECRET=<cle_longue_et_aleatoire>

# Environnement
NODE_ENV=development
```

**Générer un JWT_SECRET sécurisé :**
```bash
openssl rand -hex 32
```

---

## 3. Structure du projet

```
oh-my-matcha/
├── api/                  # Backend NestJS (port interne 3000 → externe 3001)
│   ├── Dockerfile
│   └── src/seeds/        # Données initiales (produits)
├── app/                  # Frontend React/Vite (port interne 5173)
│   ├── Dockerfile
│   └── public/images/    # Images statiques (photos produits, hero…)
├── docker-compose.yml    # Configuration des 4 conteneurs
├── .env.example          # Modèle de configuration
└── .env                  # ← À créer (non versionné)
```

---

## 4. Lancer les conteneurs

```bash
docker compose up -d
```

Cela démarre **4 conteneurs** :

| Conteneur | Rôle | Port exposé |
|---|---|---|
| `ommatcha_api` | Backend NestJS | `3001` |
| `ommatcha_app` | Frontend React (Vite) | `5173` |
| `ommatcha_db` | MongoDB 7.0 | `27017` |
| `ommatcha_mongo_express` | Interface DB (optionnel) | `8081` |

Vérifier que tout tourne :
```bash
docker compose ps
```

Tous les conteneurs doivent afficher `running`.

---

## 5. Images statiques

Toutes les images sont **incluses dans le dépôt** (dans `app/public/images/`). Aucune action requise.

| Fichier | Page | Description |
|---|---|---|
| `hero.jpg`, `gallery-1.jpg` … `gallery-5.jpg` | Accueil | Photos hero et galerie |
| `matcha.jpg`, `tapioca.jpg`, `mochi.jpg` | Accueil | Photos des produits |
| `bottom-banner.jpg` | Accueil | Bannière bas de page |
| `products/*.jpg` | Menu / Produits | Photos des 9 produits |
| `fidelite-hero.jpg` | Fidélité | Photo programme de fidélité |
| `salon-front.jpg` | Le Salon | Devanture du salon |
| `salon-interior.jpg` | Le Salon | Intérieur du salon |

---

## 6. Initialiser la base de données (seeder)

La base MongoDB est vide au premier démarrage. Il faut insérer les produits :

```bash
docker compose exec api npm run seed:products
```

Résultat attendu :
```
✅ Connected to MongoDB
🗑️  Cleared existing products
🌱 Inserted 9 products
   · matcha: 3 produits
   · bubble_tea: 3 produits
   · mochi: 3 produits
👋 Done
```

> **Important :** le seeder efface les produits existants avant de réinsérer. Ne le relancez pas en production si des commandes sont déjà en base.

---

## 7. Vérifier le bon fonctionnement

### Santé de l'API
```bash
curl http://localhost:3001/api/health
# Réponse attendue : {"status":"ok"}
```

### Liste des produits
```bash
curl http://localhost:3001/api/products
# Réponse : tableau JSON des 9 produits
```

### Interface web
Ouvrez `http://localhost:5173` dans un navigateur.

### Interface MongoDB (optionnel)
Ouvrez `http://localhost:8081` — accès direct à la base sans authentification.

---

## 8. Variables d'environnement — détail complet

| Variable | Utilisée par | Description |
|---|---|---|
| `DB_USERNAME` | API + MongoDB | Identifiant administrateur MongoDB |
| `DB_PASSWORD` | API + MongoDB | Mot de passe MongoDB |
| `DB_NAME` | API | Nom de la base (`oh_my_matcha`) |
| `JWT_SECRET` | API | Clé de signature des tokens JWT (auth) |
| `NODE_ENV` | API | `development` ou `production` |

Ces variables sont injectées automatiquement dans les conteneurs via `docker-compose.yml`.

---

## 9. Commandes utiles

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Voir les logs (tous les conteneurs)
docker compose logs -f

# Voir les logs d'un conteneur spécifique
docker compose logs -f api
docker compose logs -f app

# Relancer un seul service après modification
docker compose restart api

# Accéder au shell du conteneur API
docker compose exec api sh

# Relancer le seeder (remet les produits à zéro)
docker compose exec api npm run seed:products

# Supprimer les volumes (⚠️ efface la base MongoDB)
docker compose down -v
```

---

## 10. Configuration avec Traefik

Si votre serveur utilise **Traefik** comme reverse proxy, vous pouvez ajouter des labels aux services dans `docker-compose.yml`. Exemple minimal :

```yaml
services:
  api:
    # ... configuration existante ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ommatcha-api.rule=Host(`api.votre-domaine.fr`)"
      - "traefik.http.routers.ommatcha-api.entrypoints=websecure"
      - "traefik.http.routers.ommatcha-api.tls=true"
      - "traefik.http.services.ommatcha-api.loadbalancer.server.port=3000"

  app:
    # ... configuration existante ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ommatcha-app.rule=Host(`votre-domaine.fr`)"
      - "traefik.http.routers.ommatcha-app.entrypoints=websecure"
      - "traefik.http.routers.ommatcha-app.tls=true"
      - "traefik.http.services.ommatcha-app.loadbalancer.server.port=5173"
```

**Important avec Traefik :** mettez à jour la variable `VITE_API_URL` dans le service `app` de `docker-compose.yml` pour pointer vers le domaine de l'API :

```yaml
  app:
    environment:
      VITE_API_URL: https://api.votre-domaine.fr/api
```

> Pensez à ajouter les conteneurs au réseau externe Traefik (`traefik_network` ou selon votre config).

---

## 11. Dépannage

### Le conteneur `api` redémarre en boucle
```bash
docker compose logs api
```
Causes fréquentes :
- `.env` manquant ou mal rempli
- MongoDB pas encore prêt au démarrage (attendre 10–15 secondes et relancer)

### `seed:products` échoue avec "Authentication failed"
Vérifiez que `DB_USERNAME` et `DB_PASSWORD` dans `.env` correspondent bien à ce qui a été utilisé lors de la **première** création du volume MongoDB. Si vous avez changé le mot de passe, supprimez le volume et recommencez :
```bash
docker compose down -v
docker compose up -d
docker compose exec api npm run seed:products
```

### Le frontend affiche "Erreur réseau" sur les appels API
Le frontend utilise `VITE_API_URL=http://localhost:3001/api`. Sur un serveur distant, `localhost` n'est plus valide — il faut utiliser l'IP du serveur ou un nom de domaine. Modifiez dans `docker-compose.yml` :
```yaml
  app:
    environment:
      VITE_API_URL: http://<ip-serveur>:3001/api
```
Puis relancez : `docker compose up -d --build app`

### Port déjà utilisé
Si les ports 3001, 5173 ou 27017 sont déjà pris :
```bash
# Trouver quel processus utilise le port
ss -tulpn | grep 3001
```
Modifiez la partie gauche du mapping dans `docker-compose.yml` : `"3002:3000"` par exemple.

---

## Résumé des commandes (démarrage rapide)

```bash
git clone <url> oh-my-matcha && cd oh-my-matcha
cp .env.example .env
# ✏️  Éditez .env avec vos valeurs
docker compose up -d
# Attendez ~15 secondes que MongoDB démarre
docker compose exec api npm run seed:products
# ✅ Projet accessible sur http://localhost:5173
```
