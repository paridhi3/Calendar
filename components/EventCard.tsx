"use client";
import { useState } from "react";
import EventModal from "./EventModal";
import { MdDeleteForever } from "react-icons/md";

export default function EventCard({ event, onSaved, user }: any) {
  console.log("Card.tsx: ", user);
  const [open, setOpen] = useState(false);

  async function del() {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${event.id}`, { method: "DELETE" });
    onSaved && onSaved();
  }

  return (
    <>
      <div
        className="bg-gradient-to-r from-purple-200 to-purple-100 rounded px-2 py-1 shadow cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold">{event.title}</div>
          <button
            className="text-xs px-1"
            onClick={(e) => {
              e.stopPropagation();
              del();
            }}
          >
            <MdDeleteForever
              size={20} // size in pixels
              color="red" // color of the icon
            />
          </button>
        </div>
        {event.reminderAt && (
          <div className="text-xs text-gray-500">
            ⏰ {new Date(event.reminderAt).toLocaleString()}
          </div>
        )}
      </div>
      {open && (
        <EventModal
          event={event}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            onSaved && onSaved();
          }}
          user={user}
        />
      )}
    </>
  );
}
