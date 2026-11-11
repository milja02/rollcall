import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "../api/client.js";
import AttendanceModal from "../components/AttendanceModal.jsx";
import { STATUS, dayKey, formatTime, monthGrid, monthParam } from "../lib/calendar.js";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [assignments, setAssignments] = useState([]);
  const [programId, setProgramId] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api(`/assignments/?month=${monthParam(year, month)}`)
      .then((rows) => {
        setAssignments(rows);
        setError("");
      })
      .catch((err) => setError(errorMessage(err)));
  }, [year, month]);
  useEffect(load, [load]);

  function shiftMonth(delta) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  const programs = [...new Map(assignments.map((a) => [a.lesson.program, a.lesson.program_title]))];
  const visible = programId
    ? assignments.filter((a) => String(a.lesson.program) === programId)
    : assignments;

  const byDay = {};
  for (const a of visible) {
    const key = dayKey(new Date(a.lesson.starts_at));
    (byDay[key] ??= []).push(a);
  }

  const title = new Date(year, month, 1).toLocaleString("en-GB", { month: "long", year: "numeric" });
  const todayKey = dayKey(today);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button className="btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          ←
        </button>
        <h1 className="w-48 text-center text-xl font-semibold">{title}</h1>
        <button className="btn" onClick={() => shiftMonth(1)} aria-label="Next month">
          →
        </button>
        <select
          className="input ml-auto w-48"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          aria-label="Filter by program"
        >
          <option value="">All programs</option>
          {programs.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {error && <p role="alert" className="mb-2 text-red-700">{error}</p>}

      <div className="mb-3 flex gap-4 text-xs text-gray-600">
        {Object.entries(STATUS).map(([key, { label, dot }]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-gray-300 bg-white text-sm">
        {WEEKDAYS.map((d) => (
          <div key={d} className="border-b border-r border-gray-300 bg-gray-100 p-1 text-center font-medium">
            {d}
          </div>
        ))}
        {monthGrid(year, month)
          .flat()
          .map((day, i) => {
            const isToday = day && dayKey(day) === todayKey;
            return (
              <div
                key={i}
                className={`min-h-24 border-b border-r border-gray-300 p-1 ${isToday ? "ring-2 ring-inset ring-blue-600" : ""}`}
              >
                {day && (
                  <div
                    className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${isToday ? "bg-blue-600 font-semibold text-white" : "text-gray-500"}`}
                  >
                    {day.getDate()}
                  </div>
                )}
                {day &&
                  (byDay[dayKey(day)] ?? []).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelected(a)}
                      className={`mb-1 block w-full rounded border px-1 py-0.5 text-left text-xs ${STATUS[a.status].className}`}
                    >
                      {formatTime(a.lesson.starts_at)} {a.lesson.title}
                    </button>
                  ))}
              </div>
            );
          })}
      </div>

      {selected && (
        <AttendanceModal
          assignment={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}
