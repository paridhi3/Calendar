// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path if needed

export async function PUT(req: Request, { params }: any) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event || event.userId !== user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: data.title,
      date: new Date(data.date),
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event || event.userId !== user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.event.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}
