// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const where =
    start && end
      ? {
          date: {
            gte: new Date(start),
            lte: new Date(end),
          },
        }
      : {};

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, title, date, reminderAt, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }

    const ev = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(ev);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { eventId, title, date, reminderAt, userId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const ev = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        date: new Date(date),
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        user: { connect: { id: userId } }, 
      },
    });

    return NextResponse.json(ev);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}