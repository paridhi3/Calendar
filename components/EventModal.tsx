// components/EventModal.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface EventModalProps {
  initialDate: Date;
  event?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function EventModal({
  initialDate,
  event,
  onClose,
  onSaved,
}: EventModalProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(
    event
      ? new Date(event.date).toISOString().slice(0, 16)
      : initialDate
      ? new Date(initialDate).toISOString().slice(0, 16)
      : ""
  );
  const [reminderAt, setReminderAt] = useState(
    event?.reminderAt ? new Date(event.reminderAt).toISOString().slice(0, 16) : ""
  );

  async function save() {
    if (!title.trim()) {
      alert("Title required");
      return;
    }
    if (!user) {
      alert("User not authenticated");
      return;
    }

    const payload = {
      eventId: event?.id,
      title: title.trim(),
      date: new Date(date).toISOString(),
      reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
      userId: user.id,
    };

    try {
      const res = await fetch(`/api/events`, {
        method: event ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save event");

      if (payload.reminderAt) scheduleBrowserNotification(payload.title, payload.reminderAt);

      onSaved();
      onClose();
    } catch (error) {
      alert("Failed to save event");
      console.error(error);
    }
  }

  function scheduleBrowserNotification(title: string, whenIso: string) {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then((perm) => {
      if (perm !== "granted") return;
      const when = new Date(whenIso).getTime();
      const delay = when - Date.now();
      if (delay <= 0) {
        new Notification("Reminder: " + title);
      } else {
        setTimeout(() => {
          new Notification("Reminder: " + title);
        }, delay);
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-md max-w-md w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-3">{event ? "Edit event" : "Create event"}</h3>
        <input
          className="w-full mb-2 input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label className="text-sm font-medium block mb-1">Date & time</label>
        <input
          type="datetime-local"
          className="w-full mb-2 input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label className="text-sm font-medium block mb-1">Reminder (optional)</label>
        <input
          type="datetime-local"
          className="w-full mb-4 input"
          value={reminderAt}
          onChange={(e) => setReminderAt(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onClose}>
            Cancel
          </button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
