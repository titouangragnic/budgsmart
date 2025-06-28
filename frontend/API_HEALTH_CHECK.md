# Configuration du Health Check API

## Fonctionnalité

L'application intègre maintenant un système de vérification de l'état de l'API avec une interface de chargement élégante. Cette fonctionnalité est particulièrement utile pour les déploiements sur Render où l'API peut prendre du temps à démarrer.

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` (pour le développement) ou configurez les variables d'environnement de production :

```bash
# URL de votre API backend
VITE_API_URL=https://your-backend-url.onrender.com

# Pour le développement local
VITE_API_URL=http://localhost:3000
```

### 2. Endpoint Health Check Backend

Votre API backend doit exposer un endpoint `/health` qui renvoie un statut 200 quand elle est prête :

```javascript
// Exemple d'endpoint health check (Express.js)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Fonctionnement

1. **Démarrage** : L'application vérifie automatiquement l'état de l'API au démarrage
2. **Tentatives** : Maximum 20 tentatives avec un intervalle de 3 secondes
3. **Interface** : Affichage d'une barre de progression et du temps estimé
4. **Timeout** : Chaque requête a un timeout de 5 secondes
5. **Fallback** : En cas d'échec après toutes les tentatives, affichage d'un message d'erreur avec bouton de retry

## Composants ajoutés

- `useApiStatus` : Hook personnalisé pour la gestion du health check
- `ApiLoader` : Composant d'interface pour l'état de chargement/erreur
- Intégration dans `App.tsx` comme wrapper de l'application

## Personnalisation

Vous pouvez modifier les paramètres dans `useApiStatus.ts` :

- `MAX_RETRIES` : Nombre maximum de tentatives (défaut: 20)
- `RETRY_INTERVAL` : Intervalle entre les tentatives en ms (défaut: 3000)
- Timeout des requêtes (défaut: 5000ms)

## Styles

Le composant utilise les variables CSS globales définies dans votre thème pour une cohérence visuelle parfaite.
