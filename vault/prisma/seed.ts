import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed...')

  // Criar Usuário Admin Padrão
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vault.com' },
    update: {},
    create: {
      email: 'admin@vault.com',
      name: 'Vault Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário Admin criado:', admin.email)
  console.log('Para testar o admin, use as credenciais de OAuth que correspondam a este email, ou injete a sessão manualmente.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
