// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/events
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const where = {
    userId: user.id, // 🔑 only fetch events belonging to this user
    ...(start && end
      ? {
          date: {
            gte: new Date(start),
            lte: new Date(end),
          },
        }
      : {}),
  };

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return NextResponse.json(events);
}

// POST /api/events
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, date, reminderAt } = body;

    const ev = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        userId: user.id, // 🔑 force event to belong to logged-in user
      },
    });

    return NextResponse.json(ev);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

// // PUT /api/events
// export async function PUT(req: Request) {
//   const session = await getServerSession(authOptions);
//   const user = session?.user;

//   if (!user) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();
//     const { eventId, title, date, reminderAt } = body;

//     if (!eventId) {
//       return NextResponse.json(
//         { error: "Event ID is required" },
//         { status: 400 }
//       );
//     }

//     // 🔑 Only update if event belongs to the logged-in user
//     const ev = await prisma.event.updateMany({
//       where: {
//         id: eventId,
//         userId: user.id,
//       },
//       data: {
//         title,
//         date: new Date(date),
//         reminderAt: reminderAt ? new Date(reminderAt) : null,
//       },
//     });

//     if (ev.count === 0) {
//       return NextResponse.json(
//         { error: "Event not found or unauthorized" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(ev);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to update event" },
//       { status: 500 }
//     );
//   }
// }
