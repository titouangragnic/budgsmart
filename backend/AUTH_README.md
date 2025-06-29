# BudgSmart Backend - API d'Authentification

## Configuration

### Variables d'environnement

Créer un fichier `.env` avec :

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://username:password@localhost:5432/budgsmart?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### Installation et démarrage

```bash
# Installation des dépendances
npm install

# Génération du client Prisma
npm run db:generate

# Déploiement du schéma de base de données (développement)
npm run db:push

# Compilation TypeScript
npm run build

# Démarrage en mode développement
npm run dev

# Démarrage en production
npm start
```

## Endpoints d'authentification

### POST /api/auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Réponse (201):**
```json
{
  "message": "Inscription réussie",
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-06-29T..."
  },
  "token": "jwt.token.here"
}
```

### POST /api/auth/login
Connexion d'un utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse (200):**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-06-29T...",
    "updatedAt": "2025-06-29T..."
  },
  "token": "jwt.token.here"
}
```

### GET /api/auth/profile
Récupération du profil utilisateur (route protégée)

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-06-29T...",
    "updatedAt": "2025-06-29T..."
  }
}
```

## Endpoints de vérification

### GET /health
Vérification de l'état de l'API et de la base de données

### GET /api/status
Statut détaillé de l'API

## Déploiement sur Render

1. **Base de données PostgreSQL :**
   - Créer une base PostgreSQL sur Render
   - Copier l'URL de connexion
   - L'ajouter comme variable d'environnement `DATABASE_URL`

2. **Variables d'environnement sur Render :**
   - `DATABASE_URL`: URL de la base PostgreSQL
   - `JWT_SECRET`: Clé secrète pour JWT (générer une clé sécurisée)
   - `NODE_ENV`: production
   - `FRONTEND_URL`: URL du frontend déployé

3. **Build Command :**
   ```bash
   npm install && npm run db:generate && npm run build
   ```

4. **Start Command :**
   ```bash
   npm run db:push && npm start
   ```

## Structure des fichiers

```
src/
├── config/
│   └── database.ts          # Configuration Prisma
├── controllers/
│   └── AuthController.ts    # Contrôleurs d'authentification
├── middleware/
│   └── auth.ts             # Middleware d'authentification
├── models/
│   └── User.ts             # Types TypeScript
├── routes/
│   └── authRoutes.ts       # Routes d'authentification
├── utils/
│   └── auth.ts             # Utilitaires crypto/JWT
└── index.ts                # Point d'entrée
```
