import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Pure date helpers (no date-fns needed) ────────────────────────────────────
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth   = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const startOfWeek  = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfWeek = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() + (6 - d.getDay()));
  d.setHours(23, 59, 59, 999);
  return d;
};

const eachDayOfInterval = (start, end) => {
  const days = [];
  const cur  = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  while (cur <= endD) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

const isToday     = (d) => isSameDay(d, startOfToday());
const isSameMonth = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const fmtMonth = (d) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

// ─── Event type definitions ────────────────────────────────────────────────────
const EVENT_TYPES = [
  { id: "delivery",  label: "📦 Card Delivery",   color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  { id: "order",     label: "🛒 Order Received",   color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  { id: "followup",  label: "📞 Client Follow-up", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  { id: "reminder",  label: "🔔 Reminder",         color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
];

// ─── Add Event Modal ───────────────────────────────────────────────────────────
function AddEventModal({ day, onClose, onSave }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState(EVENT_TYPES[0].id);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: Date.now(),
      name: name.trim(),
      time,
      type,
      datetime: new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        ...time.split(":").map(Number),
      ).toISOString(),
    });
    onClose();
  };

  const dayStr = day.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-[360px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-navy">New Event</h3>
            <p className="text-[11px] text-ink/40 mt-0.5">{dayStr}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ink/5 text-ink/40 hover:text-ink/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event Name */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-ink/50 uppercase tracking-wide mb-1.5 block">
            Event Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="e.g. Card delivery for Youssef"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-ink/10 bg-ink/[0.02] text-navy placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
          />
        </div>

        {/* Event Type */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-ink/50 uppercase tracking-wide mb-1.5 block">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className="flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-medium transition-all text-left"
                style={{
                  backgroundColor: type === t.id ? t.bg        : "transparent",
                  borderColor:     type === t.id ? t.border     : "#f1f5f9",
                  color:           type === t.id ? t.color      : "#94a3b8",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="mb-6">
          <label className="text-[11px] font-semibold text-ink/50 uppercase tracking-wide mb-1.5 block">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-ink/10 bg-ink/[0.02] text-navy focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-ink/10 text-sm font-medium text-ink/50 hover:bg-ink/[0.03] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Save Event
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main EventCalendar ────────────────────────────────────────────────────────
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventCalendar({ initialEvents = [] }) {
  const today = useMemo(() => startOfToday(), []);

  // Always initialises to the current month
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState(today);
  const [events, setEvents]           = useState(initialEvents);
  const [modalDay, setModalDay]       = useState(null);
  const [hoveredDay, setHoveredDay]   = useState(null);

  // Visible days: full weeks covering the entire month
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd   = endOfMonth(currentMonth);
    return eachDayOfInterval(startOfWeek(monthStart), endOfWeek(monthEnd));
  }, [currentMonth]);

  const prevMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today);
  };

  const addEvent = useCallback((day, event) => {
    setEvents((prev) => {
      const existing = prev.find((e) => isSameDay(e.day, day));
      if (existing) {
        return prev.map((e) =>
          isSameDay(e.day, day)
            ? { ...e, events: [...e.events, event] }
            : e,
        );
      }
      return [...prev, { day: new Date(day), events: [event] }];
    });
  }, []);

  const eventsForDay = useCallback(
    (day) => events.find((e) => isSameDay(e.day, day))?.events ?? [],
    [events],
  );

  const selectedEvents = eventsForDay(selectedDay);

  return (
    <>
      <div className="mt-6 pt-5 border-t border-ink/5 flex flex-col flex-1 min-h-0">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-ink/30" />
            <div>
              <p className="text-[12px] font-bold text-navy leading-none">
                {fmtMonth(currentMonth)}
              </p>
              <p className="text-[10px] text-ink/35 mt-0.5">Schedule your events</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-[10px] font-semibold text-ink/50 border border-ink/10 rounded-lg hover:bg-ink/[0.03] transition-colors"
            >
              Today
            </button>
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-ink/10 hover:bg-ink/[0.04] text-ink/40 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-ink/10 hover:bg-ink/[0.04] text-ink/40 transition-colors"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setModalDay(selectedDay)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white text-[10px] font-bold rounded-lg hover:bg-navy/90 transition-all ml-1"
            >
              <Plus className="w-3 h-3" />
              New Event
            </button>
          </div>
        </div>

        {/* ── Weekday Headers ── */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[9px] font-bold text-ink/25 uppercase tracking-widest py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* ── Day Grid ── */}
        <div className="grid grid-cols-7 gap-[2px]">
          {days.map((day, idx) => {
            const dayEvents  = eventsForDay(day);
            const isSelected = isSameDay(day, selectedDay);
            const isCurMonth = isSameMonth(day, currentMonth);
            const isTodayDay = isToday(day);
            const isHovered  = hoveredDay && isSameDay(hoveredDay, day);

            return (
              <motion.button
                key={idx}
                onClick={() => setSelectedDay(day)}
                onDoubleClick={() => setModalDay(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                animate={{ scale: isHovered && !isSelected ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "relative flex flex-col items-center rounded-lg py-1.5 px-0.5 cursor-pointer transition-colors",
                  !isCurMonth && "opacity-30",
                  isSelected && !isTodayDay && "bg-navy/5 ring-1 ring-navy/15",
                  isTodayDay && isSelected  && "bg-orange-50 ring-1 ring-orange-200",
                  !isSelected && "hover:bg-ink/[0.03]",
                )}
              >
                {/* Day number bubble */}
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold leading-none mb-1 transition-colors",
                    isTodayDay
                      ? "bg-[#F97316] text-white"
                      : isSelected
                      ? "bg-navy text-white"
                      : "text-ink/55",
                  )}
                >
                  {day.getDate()}
                </span>

                {/* Event dots */}
                <div className="flex gap-[3px] flex-wrap justify-center h-2">
                  {dayEvents.slice(0, 3).map((ev) => {
                    const t = EVENT_TYPES.find((x) => x.id === ev.type) ?? EVENT_TYPES[0];
                    return (
                      <span
                        key={ev.id}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[7px] text-ink/30 font-bold leading-none self-end">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>

                {/* Ghost plus on empty hover */}
                {isHovered && dayEvents.length === 0 && (
                  <Plus className="absolute bottom-1 w-2.5 h-2.5 text-ink/15" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── Selected Day Events ── */}
        <AnimatePresence mode="wait">
          {selectedEvents.length > 0 ? (
            <motion.div
              key={selectedDay.toISOString()}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-4 pt-4 border-t border-ink/5 space-y-1.5"
            >
              <p className="text-[10px] font-semibold text-ink/40 uppercase tracking-widest mb-2">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "long", month: "short", day: "numeric",
                })}
              </p>
              {selectedEvents.map((ev) => {
                const t = EVENT_TYPES.find((x) => x.id === ev.type) ?? EVENT_TYPES[0];
                return (
                  <div
                    key={ev.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border text-[11px]"
                    style={{ backgroundColor: t.bg, borderColor: t.border }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="font-semibold text-navy flex-1 truncate">{ev.name}</span>
                    <span className="text-ink/40 shrink-0 tabular-nums">{ev.time}</span>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 pt-4 border-t border-ink/5"
            >
              <button
                onClick={() => setModalDay(selectedDay)}
                className="flex items-center gap-2 group w-full"
              >
                <Plus className="w-3.5 h-3.5 text-ink/20 group-hover:text-orange-400 transition-colors" />
                <p className="text-[11px] text-ink/25 group-hover:text-ink/50 transition-colors">
                  Double-click a day or click here to schedule an event
                </p>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Add Event Modal ── */}
      <AnimatePresence>
        {modalDay && (
          <AddEventModal
            day={modalDay}
            onClose={() => setModalDay(null)}
            onSave={(event) => {
              addEvent(modalDay, event);
              setSelectedDay(modalDay);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
