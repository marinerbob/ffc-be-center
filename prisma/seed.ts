import { PrismaClient } from '@prisma/client'
import { genSalt, hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  await prisma.authSession.deleteMany()

  const salt = await genSalt(Number(process.env.SALT_GEN_ROUNDS))
  const passwordHash = await hash(process.env.ADMIN_PASS_SEED, salt)

  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL_SEED,
      passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
