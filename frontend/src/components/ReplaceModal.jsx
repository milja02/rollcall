import { useState } from "react";
import { api, errorMessage } from "../api/client.js";
import LecturerPicker from "./LecturerPicker.jsx";
import Modal from "./Modal.jsx";

export default function ReplaceModal({ assignment, onClose, onSaved }) {
  const [selected, setSelected] = useState([]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleReplace() {
    try {
      await api(`/assignments/${assignment.id}/replace/`, {
        method: "POST",
        body: { lecturer_id: selected[0], reason },
      });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Modal title={`Replace ${assignment.lecturer.full_name}`} onClose={onClose}>
      <LecturerPicker selected={selected} onChange={setSelected} />
      <label className="label mt-3" htmlFor="reason">
        Reason
      </label>
      <textarea
        id="reason"
        className="input"
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <button className="btn btn-primary mt-3" disabled={selected.length === 0} onClick={handleReplace}>
        Replace
      </button>
    </Modal>
  );
}
