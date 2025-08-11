// components/EventCard.tsx
"use client";
import { useState } from "react";
import EventModal from "./EventModal";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";

interface EventCardProps {
  event: any;
  onSaved: () => void;
  user?: any;
}

export default function EventCard({ event, onSaved }: EventCardProps) {
  const [openEdit, setOpenEdit] = useState(false);

  async function deleteEvent() {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await onSaved(); // Wait for parent refresh
    } catch (error) {
      alert("Failed to delete event");
      console.error(error);
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-purple-200 to-purple-100 rounded px-2 py-1 shadow">
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold">{event.title}</div>
          <div className="flex gap-1">
            <MdModeEdit
              size={20}
              className="cursor-pointer"
              title="Edit event"
              onClick={(e) => {
                e.stopPropagation();
                setOpenEdit(true);
              }}
            />
            <MdDeleteForever
              size={20}
              color="red"
              className="cursor-pointer"
              title="Delete event"
              onClick={(e) => {
                e.stopPropagation();
                deleteEvent();
              }}
            />
          </div>
        </div>
        {event.reminderAt && (
          <div className="text-xs text-gray-500">
            ⏰ {new Date(event.reminderAt).toLocaleString()}
          </div>
        )}
      </div>

      {openEdit && (
        <EventModal
          initialDate={new Date(event.date)}
          event={event}
          onClose={() => setOpenEdit(false)}
          onSaved={() => {
            setOpenEdit(false);
            onSaved();
          }}
        />
      )}
    </>
  );
}
