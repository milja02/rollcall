import { STATUS } from "../lib/calendar.js";

export default function StatusBadge({ status }) {
  const { label, className } = STATUS[status];
  return <span className={`rounded border px-2 py-0.5 text-xs ${className}`}>{label}</span>;
}
