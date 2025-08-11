// app/api/user/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, events, createdAt, } = body;

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        events,
        createdAt,
      },
    });

    // Create events
    if (events && events.length > 0) {
      await prisma.event.createMany({
        data: events.map((ev) => ({
          title: ev.title,
          date: ev.date,
          allDay: ev.allDay,
          createdAt: ev.createdAt,
          updatedAt: ev.updatedAt,
          reminderAt: ev.reminderAt
        })),
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
