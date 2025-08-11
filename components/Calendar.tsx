// components/Calendar.tsx
"use client";
import { useEffect, useState } from "react";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import Day from "./Day";
import EventModal from "./EventModal";
import LoginModal from "./LoginModal"; // your login modal component
import { useSession } from "next-auth/react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

export default function Calendar() {
  const { data: session, status } = useSession();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [openEventDate, setOpenEventDate] = useState<Date | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  // if (status === "loading") return <div>Loading...</div>;

  const user = session?.user;
  console.log("Calendar: ", user);

  async function fetchEvents() {
    const res = await fetch(`/api/events?start=${start}&end=${end}`);
    const data = await res.json();
    setEvents(data);
  }

  useEffect(() => {
    fetchEvents();
  }, [date]);

  function handleCreateEvent(day: Date) {
    if (user) {
      setOpenEventDate(day);
    } else {
      setShowLoginModal(true);
    }
  }

  return (
    <div className="bg-white bg-opacity-50 backdrop-blur-md p-7 max-w-6xl mx-auto rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 text-black bg-white font-semibold rounded-full me-2 mb-2"
            onClick={() => setDate(subMonths(date, 1))}
          >
            <MdArrowBack size={20} />
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 text-black bg-white font-semibold rounded-full me-2 mb-2"
            onClick={() => setDate(addMonths(date, 1))}
          >
            <MdArrowForward size={20} />
          </button>
        </div>
        <h2 className="text-4xl font-bold">{format(date, "MMMM yyyy")}</h2>
        <div />
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map((d) => (
          <Day
            key={d.toISOString()}
            date={d}
            isCurrentMonth={isSameMonth(d, date)}
            events={events.filter(
              (e) => new Date(e.date).toDateString() === d.toDateString()
            )}
            onCreate={() => handleCreateEvent(d)}
            onUpdated={fetchEvents}
            user={user}
          />
        ))}
      </div>

      {/* Event creation modal */}
      {openEventDate && (
        <EventModal
          initialDate={openEventDate}
          onClose={() => setOpenEventDate(null)}
          onSaved={() => {
            setOpenEventDate(null);
            fetchEvents();
          }}
        />
      )}

      {/* Login modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
