import { useState } from "react";
import { api, errorMessage } from "../api/client.js";
import { canReport, formatDateTime, formatTime } from "../lib/calendar.js";
import Modal from "./Modal.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function AttendanceModal({ assignment, onClose, onSaved }) {
  const [choice, setChoice] = useState("");
  const [error, setError] = useState("");

  const { lesson } = assignment;
  const editable = canReport(assignment);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api(`/assignments/${assignment.id}/report/`, {
        method: "POST",
        body: { attendance: choice },
      });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Modal title={lesson.title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <dl className="grid grid-cols-[6rem_1fr] gap-y-1 text-sm">
          <dt className="font-medium">Program</dt>
          <dd>{lesson.program_title}</dd>
          <dt className="font-medium">Date</dt>
          <dd>{formatDateTime(lesson.starts_at)}</dd>
          <dt className="font-medium">Ends</dt>
          <dd>{formatTime(lesson.ends_at)}</dd>
          {lesson.description && (
            <>
              <dt className="font-medium">Description</dt>
              <dd>{lesson.description}</dd>
            </>
          )}
          <dt className="font-medium">Status</dt>
          <dd>
            <StatusBadge status={assignment.status} />
          </dd>
        </dl>

        {assignment.status === "REJECTED" && (
          <p className="rounded border border-red-300 bg-red-50 p-2 text-sm">
            Rejected: {assignment.review_comment}
          </p>
        )}

        <fieldset disabled={!editable} className="space-y-1">
          <legend className="label">Attendance</legend>
          {["PRESENT", "ABSENT"].map((value) => (
            <label key={value} className="mr-4 inline-flex items-center gap-1">
              <input
                type="radio"
                name="attendance"
                value={value}
                checked={choice === value}
                onChange={() => setChoice(value)}
              />
              {value === "PRESENT" ? "Present" : "Absent"}
            </label>
          ))}
        </fieldset>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={!editable || !choice}>
            Submit
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
