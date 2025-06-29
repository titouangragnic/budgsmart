# Guide de Déploiement Base de Données - BudgSmart

## Configuration requise pour Render

### 1. Variables d'environnement à configurer sur Render

```env
# Base de données (fournie par Render PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Authentification
JWT_SECRET=your-super-secret-jwt-key-generate-a-strong-one

# Application
NODE_ENV=production
PORT=3000

# Frontend (optionnel, pour CORS)
FRONTEND_URL=https://your-frontend-url.com
```

### 2. Configuration du service Render

**Build Command:**
```bash
npm ci && npm run db:generate && npm run build
```

**Start Command:**
```bash
npm run db:migrate:deploy && npm start
```

Ou utiliser le script de déploiement automatisé :

**Build Command:**
```bash
./scripts/deploy.sh
```

**Start Command:**
```bash
npm start
```

### 3. Configuration de la base de données PostgreSQL

1. **Créer un service PostgreSQL sur Render :**
   - Nom : `budgsmart-db`
   - Plan : Free (pour les tests)
   - Version PostgreSQL : 14+

2. **Récupérer l'URL de connexion :**
   - Copier l'URL de connexion interne depuis le dashboard Render
   - Format : `postgresql://username:password@hostname:5432/database`

3. **Ajouter l'URL dans les variables d'environnement du service backend**

### 4. Workflow GitHub Actions

Le workflow automatise :

✅ **Installation et build**
✅ **Génération du client Prisma**
✅ **Déploiement des migrations**
✅ **Test de connexion DB**
✅ **Déclenchement du déploiement Render**

**Secrets GitHub requis :**
- `DATABASE_URL` : URL de la base PostgreSQL Render
- `JWT_SECRET` : Clé secrète pour JWT
- `RENDER_DEPLOY_HOOK_URL` : URL du webhook de déploiement Render

### 5. Scripts disponibles

```bash
# Développement local
npm run dev                    # Démarrer en mode développement
npm run db:generate           # Générer le client Prisma
npm run db:push              # Pousser le schéma (dev)
npm run db:migrate           # Créer une migration (dev)

# Production / Déploiement
npm run build                # Compiler TypeScript
npm run db:migrate:deploy    # Appliquer les migrations (prod)
npm run db:check            # Vérifier la santé de la DB
npm run deploy              # Script de déploiement complet
npm start                   # Démarrer en production

# Maintenance
npm run db:reset            # Reset complet de la DB (dev only)
npm run db:seed             # Insérer des données de test
```

### 6. Ordre de déploiement recommandé

1. **Créer la base PostgreSQL sur Render**
2. **Configurer les variables d'environnement**
3. **Déployer le backend via GitHub Actions**
4. **Vérifier les logs de déploiement**
5. **Tester les endpoints d'authentification**

### 7. Vérification post-déploiement

Tester les endpoints :

```bash
# Santé de l'API
curl https://your-app.onrender.com/health

# Statut détaillé
curl https://your-app.onrender.com/api/status

# Test d'inscription
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

### 8. Troubleshooting

**Erreur de connexion DB :**
- Vérifier `DATABASE_URL` dans les variables d'environnement
- S'assurer que la DB PostgreSQL est démarrée
- Vérifier les logs Render

**Erreur de migration :**
- Vérifier que le schéma Prisma est valide
- Consulter les logs de `db:migrate:deploy`
- En cas de problème, utiliser `db:push` en développement

**Erreur JWT :**
- Vérifier que `JWT_SECRET` est défini et suffisamment long
- Régénérer une nouvelle clé secrète si nécessaire

### 9. Monitoring

- **Logs Render :** Dashboard Render > Service > Logs
- **Métriques :** Dashboard Render > Service > Metrics
- **Health Check :** Endpoint `/health` pour surveillance automatique
