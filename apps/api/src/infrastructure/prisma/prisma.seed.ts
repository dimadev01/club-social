import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';

import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';

import { PrismaClient, UserRole } from '../prisma/generated/client';
import { Database } from '../supabase/supabase.types';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set');
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'info@clubsocialmontegrande.ar',
    email_confirm: true,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  await prisma.user.create({
    data: {
      authId: data.user.id,
      createdAt: new Date(),
      createdBy: 'System',
      deletedAt: null,
      deletedBy: null,
      email: 'info@clubsocialmontegrande.ar',
      firstName: 'Admin',
      id: UniqueId.generate().value,
      lastName: 'Admin',
      role: UserRole.ADMIN,
      updatedAt: new Date(),
      updatedBy: 'System',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
