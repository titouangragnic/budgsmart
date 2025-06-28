# Exemple d'endpoint /health pour votre backend

Voici un exemple d'implémentation de l'endpoint `/health` pour différents frameworks backend :

## Express.js (Node.js)

```javascript
// routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;

// Dans votre app.js principal
const healthRoutes = require('./routes/health');
app.use('/', healthRoutes);
```

## Express.js avec vérifications avancées

```javascript
router.get('/health', async (req, res) => {
  try {
    // Vérifier la base de données (exemple avec MongoDB)
    const dbStatus = await checkDatabaseConnection();
    
    // Vérifier d'autres services si nécessaire
    const servicesStatus = await checkExternalServices();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus ? 'connected' : 'disconnected',
      services: servicesStatus,
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

async function checkDatabaseConnection() {
  try {
    // Exemple avec Mongoose
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
  } catch (error) {
    return false;
  }
}

async function checkExternalServices() {
  // Vérifier les services externes si nécessaire
  return {
    redis: true, // exemple
    email: true  // exemple
  };
}
```

## FastAPI (Python)

```python
from fastapi import APIRouter, HTTPException
from datetime import datetime
import psutil
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    try:
        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat(),
            "uptime": time.time() - psutil.boot_time(),
            "environment": os.getenv("ENVIRONMENT", "development"),
            "memory": psutil.virtual_memory()._asdict()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
```

## Configuration pour Render

Assurez-vous que votre service Render expose le port correct et que l'endpoint `/health` est accessible publiquement.

Dans votre configuration Render, l'URL sera quelque chose comme :
`https://your-app-name.onrender.com/health`

## CORS (Important !)

N'oubliez pas de configurer CORS pour permettre à votre frontend d'accéder à l'endpoint :

```javascript
// Express.js avec cors
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

L'endpoint `/health` doit être disponible même si d'autres parties de votre API nécessitent une authentification.
