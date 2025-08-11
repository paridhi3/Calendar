"use client";
import { format, isToday } from "date-fns";
import EventCard from "./EventCard";

export default function Day({ date, events = [], isCurrentMonth, onCreate, onUpdated, user }: any) {
  console.log("Day.tsx: ", user);
  const today = isToday(date);

  return (
    <div
      className={`relative border rounded p-2 min-h-[120px] cursor-pointer group transition-all
        ${today
          ? "bg-gradient-to-br from-yellow-300 to-white text-white border-yellow-500 shadow-lg shadow-pink-300"
          : isCurrentMonth
            ? "bg-white/60"
            : "bg-black/20 text-black"
        }`}
      onClick={onCreate}
    >
      <div className="flex justify-between items-start">
        <div
          className={`text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center
            ${today ? "bg-white text-pink-600 font-bold shadow-inner" : ""}`}
        >
          {format(date, "d")}
        </div>
      </div>

      <div className="mt-2 space-y-2">
        {events.map((ev: any) => (
          <EventCard key={ev.id} event={ev} onSaved={onUpdated} user={user}/>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
        Create Event
      </div>
    </div>
  );
}
