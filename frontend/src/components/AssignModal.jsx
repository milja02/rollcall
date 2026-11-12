import { useState } from "react";
import { api, errorMessage } from "../api/client.js";
import LecturerPicker from "./LecturerPicker.jsx";
import Modal from "./Modal.jsx";

export default function AssignModal({ lesson, onClose, onSaved }) {
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  async function handleAssign() {
    try {
      await api(`/lessons/${lesson.id}/assignments/`, {
        method: "POST",
        body: { lecturer_ids: selected },
      });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Modal title={`Assign lecturers: ${lesson.title}`} onClose={onClose}>
      <LecturerPicker multiple selected={selected} onChange={setSelected} />
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <button className="btn btn-primary mt-3" disabled={selected.length === 0} onClick={handleAssign}>
        Assign
      </button>
    </Modal>
  );
}
