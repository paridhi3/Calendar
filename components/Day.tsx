// components/Day.tsx
"use client";
import { format, isToday } from "date-fns";
import { useState } from "react";
import EventCard from "./EventCard";
import { FaPlus } from "react-icons/fa";
import EventModal from "./EventModal";
import { toLocalNoon } from "../lib/utils";

interface DayProps {
  date: Date;
  events: any[];
  isCurrentMonth: boolean;
  onCreate: () => void;
  onUpdated: () => void;
  user: any;
}

export default function Day({
  date,
  events,
  isCurrentMonth,
  onCreate,
  onUpdated,
  user,
}: DayProps) {
  const today = isToday(date);
  const [openAddModal, setOpenAddModal] = useState(false);

  function handleClick(e: React.MouseEvent) {
    if (e.currentTarget === e.target) {
      onCreate();
    }
  }

  return (
    <div
      className={`relative border rounded p-2 cursor-pointer group transition-all
    ${
      today
        ? "bg-gradient-to-br from-yellow-300 to-white text-white border-yellow-500 shadow-lg shadow-pink-300"
        : isCurrentMonth
        ? "bg-white/60"
        : "bg-black/20 text-black"
    }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCreate();
        }
      }}
      aria-label={`Day ${format(date, "d")}, ${events.length} events`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center
          ${today ? "bg-white text-pink-600 font-bold shadow-inner" : ""}`}
        >
          {format(date, "d")}
        </div>
      </div>

      <div className="mt-2 space-y-2 max-h-16 sm:max-h-18 md:max-h-20 lg:max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400">
        {user &&
          events.map((ev) => (
            <EventCard key={ev.id} event={ev} onSaved={onUpdated} user={user} />
          ))}

        {events.length > 0 && (
          <div
            className="flex items-center justify-center mt-2 cursor-pointer text-indigo-600 hover:text-indigo-800"
            title="Add new event"
            onClick={(e) => {
              e.stopPropagation();
              setOpenAddModal(true);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setOpenAddModal(true);
              }
            }}
            aria-label="Add new event"
          >
            <FaPlus size={20} />
          </div>
        )}
      </div>

      {events.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label="Create event"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onCreate();
            }
          }}
        >
          Create Event
        </div>
      )}

      {openAddModal && (
        <EventModal
          initialDate={toLocalNoon(date)}
          onClose={() => setOpenAddModal(false)}
          onSaved={() => {
            setOpenAddModal(false);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
