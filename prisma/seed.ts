import { parseArgs } from 'node:util'

import { PrismaClient } from '@prisma/client'
import { genSalt, hash } from 'bcrypt'
import { config } from 'dotenv'

const options = {
  environment: { type: 'string' },
}

const prisma = new PrismaClient()

async function main() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { values: { environment } } = parseArgs({ options })

  switch (environment) {
    case 'production':
      config({ path: './.env.production.local' })
      break
    default:
      config({ path: './.env.development.local' })
      break
  }

  await prisma.user.deleteMany()
  await prisma.password.deleteMany()

  const salt = await genSalt(Number(process.env.SALT_GEN_ROUNDS))
  const hashPassword = await hash(process.env.ADMIN_PASS_SEED, salt)

  const adminPass = await prisma.password.create({
    data: {
      value: hashPassword,
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL_SEED,
      passwordId: adminPass.id,
      role: 'ADMIN',
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
