#!/bin/bash

# Script de déploiement pour Render
# Ce script est exécuté automatiquement lors du déploiement sur Render

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Début du déploiement BudgSmart Backend..."

# 1. Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci

# 2. Génération du client Prisma
echo "🔧 Génération du client Prisma..."
npm run db:generate

# 3. Compilation TypeScript
echo "🔨 Compilation TypeScript..."
npm run build

# 4. Déploiement des migrations de base de données
echo "🗄️ Déploiement des migrations de base de données..."
npm run db:migrate:deploy

# 5. Vérification de la santé de la base de données
echo "🔍 Vérification de la santé de la base de données..."
npm run db:check

echo "✅ Déploiement terminé avec succès !"
echo "🎉 L'application est prête à être démarrée !"
