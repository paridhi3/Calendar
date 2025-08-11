import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.event.createMany({
    data: [
      { title: 'Welcome Event', date: new Date(), reminderAt: null },
    ]
  })
  console.log('Seeded')
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
