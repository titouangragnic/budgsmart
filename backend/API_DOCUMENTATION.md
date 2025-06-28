# Backend BudgSmart - API Documentation

## Endpoints disponibles

### Health Check
- **GET** `/health`
  - Vérifie l'état de l'API
  - Retourne : `{ status, timestamp, uptime, environment, version }`
  - Statut : 200 OK

### Status détaillé
- **GET** `/api/status`
  - Informations détaillées sur l'API
  - Retourne : service, uptime, mémoire, endpoints disponibles
  - Statut : 200 OK

### Users
- **GET** `/api/users`
  - Liste des utilisateurs
  - Retourne : tableau d'utilisateurs

## Configuration

### Variables d'environnement

```bash
PORT=3000                    # Port du serveur (défaut: 3000)
NODE_ENV=development         # Environnement (development/production)
FRONTEND_URL=http://localhost:5173  # URL du frontend pour CORS
```

### CORS

Le serveur est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5174` (Vite dev server alternatif)
- URL configurée via `FRONTEND_URL`

## Déploiement

### Render.com

1. Connecter le repository GitHub
2. Configurer les variables d'environnement :
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend-url.com`
3. Build command : `npm run build`
4. Start command : `npm start`

### Scripts disponibles

```bash
npm run dev     # Développement avec hot-reload
npm run build   # Compilation TypeScript
npm start       # Production (nécessite build)
```

## Logs

Le serveur affiche automatiquement :
- Timestamp de chaque requête
- Méthode HTTP et chemin
- Status des réponses

Exemple :
```
2025-06-28T21:27:06.866Z - GET /health
Server running on http://localhost:3000
```
