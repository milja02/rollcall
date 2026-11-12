import { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function LecturerPicker({ multiple, selected, onChange }) {
  const [search, setSearch] = useState("");
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    api(`/lecturers/?search=${encodeURIComponent(search)}`).then(setLecturers);
  }, [search]);

  function toggle(id) {
    if (!multiple) return onChange([id]);
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  return (
    <div>
      <input
        className="input mb-2"
        placeholder="Search lecturers…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="max-h-40 overflow-auto rounded border border-gray-300">
        {lecturers.map((l) => (
          <li key={l.id}>
            <label className="flex cursor-pointer items-center gap-2 px-2 py-1 hover:bg-gray-100">
              <input
                type={multiple ? "checkbox" : "radio"}
                name="lecturer"
                checked={selected.includes(l.id)}
                onChange={() => toggle(l.id)}
              />
              <span>{l.full_name}</span>
              <span className="text-xs text-gray-500">{l.email}</span>
            </label>
          </li>
        ))}
        {lecturers.length === 0 && (
          <li className="px-2 py-1 text-sm text-gray-500">No lecturers found.</li>
        )}
      </ul>
    </div>
  );
}
