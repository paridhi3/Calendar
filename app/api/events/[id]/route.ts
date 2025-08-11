// app/api/events/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: any) {
  const data = await req.json()
  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description ?? null,
      date: new Date(data.date),
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : null,
      color: data.color ?? null
    }
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: any) {
  await prisma.event.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
