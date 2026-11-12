import { useState } from "react";
import { api, errorMessage } from "../api/client.js";
import { fromLocalInput, toLocalInput } from "../lib/calendar.js";
import Modal from "./Modal.jsx";

export default function LessonForm({ programId, lesson, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: lesson?.title ?? "",
    description: lesson?.description ?? "",
    starts_at: lesson ? toLocalInput(lesson.starts_at) : "",
    ends_at: lesson ? toLocalInput(lesson.ends_at) : "",
  });
  const [error, setError] = useState("");
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api(lesson ? `/lessons/${lesson.id}/` : "/lessons/", {
        method: lesson ? "PATCH" : "POST",
        body: {
          program: programId,
          title: form.title,
          description: form.description,
          starts_at: form.starts_at ? fromLocalInput(form.starts_at) : null,
          ends_at: form.ends_at ? fromLocalInput(form.ends_at) : null,
        },
      });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Modal title={lesson ? "Edit lesson" : "New lesson"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label" htmlFor="l-title">
            Title
          </label>
          <input id="l-title" className="input" value={form.title} onChange={set("title")} />
        </div>
        <div>
          <label className="label" htmlFor="l-start">
            Starts
          </label>
          <input
            id="l-start"
            type="datetime-local"
            className="input"
            value={form.starts_at}
            onChange={set("starts_at")}
          />
        </div>
        <div>
          <label className="label" htmlFor="l-end">
            Ends
          </label>
          <input
            id="l-end"
            type="datetime-local"
            className="input"
            value={form.ends_at}
            onChange={set("ends_at")}
          />
        </div>
        <div>
          <label className="label" htmlFor="l-desc">
            Description
          </label>
          <textarea
            id="l-desc"
            className="input"
            rows={2}
            value={form.description}
            onChange={set("description")}
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary">Save</button>
      </form>
    </Modal>
  );
}
