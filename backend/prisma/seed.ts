import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un utilisateur de test (optionnel)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@budgsmart.com' },
    update: {},
    create: {
      email: 'test@budgsmart.com',
      password: await hashPassword('test123456'),
      firstName: 'Test',
      lastName: 'User',
    },
  });

  console.log('✅ Utilisateur de test créé :', testUser.email);
  console.log('🌱 Seeding terminé avec succès !');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur pendant le seeding :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
