# BudgSmart Backend API

Une API REST construite avec TypeScript, Express.js, TypeORM et PostgreSQL suivant l'architecture MVC.

## 🚀 Technologies

- **Node.js** avec TypeScript
- **Express.js** - Framework web
- **TypeORM** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **class-validator** - Validation des données

## 📁 Structure du projet

```
src/
├── config/          # Configuration (base de données)
├── controllers/     # Contrôleurs (logique des routes)
├── middleware/      # Middlewares (auth, erreurs)
├── models/          # Modèles TypeORM
├── routes/          # Définition des routes
├── services/        # Logique métier
├── types/           # Types TypeScript
├── utils/           # Utilitaires
└── index.ts         # Point d'entrée
```

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

3. Modifier le fichier `.env` avec vos paramètres :
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=budgsmart
JWT_SECRET=your-super-secret-jwt-key
```

4. Démarrer PostgreSQL et créer la base de données :
```sql
CREATE DATABASE budgsmart;
```

## 🏃‍♂️ Utilisation

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

### Migrations TypeORM
```bash
# Générer une migration
npm run migration:generate -- src/migrations/MigrationName

# Exécuter les migrations
npm run migration:run

# Annuler la dernière migration
npm run migration:revert
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur (protégé)

### Utilisateurs
- `GET /api/users/profile` - Obtenir le profil
- `PUT /api/users/profile` - Mettre à jour le profil
- `DELETE /api/users/profile` - Supprimer le compte
- `GET /api/users/stats` - Statistiques utilisateur

### Transactions
- `POST /api/transactions` - Créer une transaction
- `GET /api/transactions` - Lister les transactions (avec filtres et pagination)
- `GET /api/transactions/:id` - Obtenir une transaction
- `PUT /api/transactions/:id` - Mettre à jour une transaction
- `DELETE /api/transactions/:id` - Supprimer une transaction
- `GET /api/transactions/stats` - Statistiques des transactions

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre-token-jwt>
```

## 📊 Modèles de données

### User
```typescript
{
  id: string (UUID)
  email: string
  firstName: string
  lastName: string
  password: string (hashé)
  balance: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Transaction
```typescript
{
  id: string (UUID)
  description: string
  amount: number
  type: 'income' | 'expense'
  category: TransactionCategory
  date: Date
  notes?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
```

## 🎯 Fonctionnalités

- ✅ Authentification JWT
- ✅ Validation des données
- ✅ Gestion d'erreurs centralisée
- ✅ Pagination des résultats
- ✅ Filtres de recherche
- ✅ Calcul automatique du solde
- ✅ Statistiques et analyses
- ✅ Relations entre entités
- ✅ Middleware d'authentification

## 🚨 Codes d'erreur

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Interdit
- `404` - Non trouvé
- `409` - Conflit (ressource existe déjà)
- `500` - Erreur serveur

## 🔧 Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NODE_ENV` | Environnement | `development` |
| `PORT` | Port du serveur | `3000` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_USERNAME` | Utilisateur BDD | `postgres` |
| `DB_PASSWORD` | Mot de passe BDD | `password` |
| `DB_DATABASE` | Nom de la BDD | `budgsmart` |
| `JWT_SECRET` | Clé secrète JWT | - |
| `JWT_EXPIRES_IN` | Durée du token | `7d` |
