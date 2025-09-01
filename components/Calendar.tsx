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
import LoginModal from "./LoginModal";
import { useSession } from "next-auth/react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { toLocalNoon } from "../lib/utils";
import { useLoader } from "../context/LoaderContext";

export default function Calendar() {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { loading, setLoading } = useLoader();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [openEventDate, setOpenEventDate] = useState<Date | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      setEvents([]); // clear events if logged out
    }
  }, [currentDate, user]);

  async function fetchEvents() {
    if (!user) return;
    try {
      setLoading(true); // show loader
      const res = await fetch(
        `/api/events?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // hide loader
    }
  }

  function handleCreateEvent(day: Date) {
    if (user) {
      setOpenEventDate(toLocalNoon(day));
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
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            aria-label="Previous Month"
          >
            <MdArrowBack size={20} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 text-black bg-white font-semibold rounded-full me-2 mb-2"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            aria-label="Next Month"
          >
            <MdArrowForward size={20} />
          </button>
        </div>
        <h2 className="text-4xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div />
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium select-none">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-2 mt-2 auto-rows-[80px] sm:auto-rows-[100px]">
        {days.map((day) => {
          const dayEvents = events.filter(
            (e) => new Date(e.date).toDateString() === day.toDateString()
          );
          return (
            <Day
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isSameMonth(day, currentDate)}
              events={dayEvents}
              onCreate={() => handleCreateEvent(day)}
              onUpdated={fetchEvents}
              user={user}
            />
          );
        })}
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
