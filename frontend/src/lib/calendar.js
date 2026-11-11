export const STATUS = {
    ASSIGNED: { label: "Assigned", className: "bg-blue-100 border-blue-400 text-blue-900", dot: "bg-blue-500" },
    REPORTED: { label: "Reported", className: "bg-amber-100 border-amber-400 text-amber-900", dot: "bg-amber-500" },
    CONFIRMED: { label: "Confirmed", className: "bg-green-100 border-green-500 text-green-900", dot: "bg-green-600" },
    REJECTED: { label: "Rejected", className: "bg-red-100 border-red-400 text-red-900", dot: "bg-red-500" },
};

export function monthGrid(year, month) {
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
}

export const monthParam = (year, month) => `${year}-${String(month + 1).padStart(2, "0")}`;

export const dayKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function canReport(assignment, now = new Date()) {
    if (!["ASSIGNED", "REJECTED"].includes(assignment.status)) return false;
    return dayKey(new Date(assignment.lesson.starts_at)) <= dayKey(now);
}

export const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

export const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function toLocalInput(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const fromLocalInput = (value) => new Date(value).toISOString();
