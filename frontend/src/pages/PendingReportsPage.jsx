import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "../api/client.js";
import Modal from "../components/Modal.jsx";
import { formatDateTime } from "../lib/calendar.js";

export default function PendingReportsPage() {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState("");
  const [rows, setRows] = useState([]);
  const [rejecting, setRejecting] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/programs/").then(setPrograms);
  }, []);

  const load = useCallback(() => {
    const filter = programId ? `&program=${programId}` : "";
    api(`/assignments/?status=REPORTED${filter}`)
      .then(setRows)
      .catch((err) => setError(errorMessage(err)));
  }, [programId]);
  useEffect(() => {
    load();
  }, [load]);

  async function decide(assignment, action, body) {
    try {
      await api(`/assignments/${assignment.id}/${action}/`, { method: "POST", body });
      setRejecting(null);
      setComment("");
      setError("");
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center">
        <h1 className="text-xl font-semibold">Pending attendance reports</h1>
        <select
          className="input ml-auto w-48"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          aria-label="Filter by program"
        >
          <option value="">All programs</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      {error && <p role="alert" className="mb-2 text-red-700">{error}</p>}

      <table className="card w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="p-2">Lecturer</th>
            <th className="p-2">Lesson</th>
            <th className="p-2">Date</th>
            <th className="p-2">Reported</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-gray-200">
              <td className="p-2">{a.lecturer.full_name}</td>
              <td className="p-2">{a.lesson.title}</td>
              <td className="p-2">{formatDateTime(a.lesson.starts_at)}</td>
              <td className="p-2">{a.attendance === "PRESENT" ? "Present" : "Absent"}</td>
              <td className="space-x-2 p-2 text-right">
                <button className="btn btn-primary" onClick={() => decide(a, "confirm")}>
                  Confirm
                </button>
                <button className="btn btn-danger" onClick={() => setRejecting(a)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-2 text-gray-600" colSpan={5}>
                Nothing is waiting for review.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {rejecting && (
        <Modal title="Reject report" onClose={() => setRejecting(null)}>
          <label className="label" htmlFor="comment">
            Reason (required)
          </label>
          <textarea
            id="comment"
            className="input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="btn btn-danger mt-3"
            disabled={!comment.trim()}
            onClick={() => decide(rejecting, "reject", { comment })}
          >
            Reject
          </button>
        </Modal>
      )}
    </div>
  );
}
