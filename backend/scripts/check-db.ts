#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseHealth() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...');
    
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Test de requête simple
    const userCount = await prisma.user.count();
    console.log(`📊 Nombre d'utilisateurs en base : ${userCount}`);

    // Test de santé des tables
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Base de données opérationnelle');

    console.log('🎉 Toutes les vérifications sont passées !');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseHealth();
