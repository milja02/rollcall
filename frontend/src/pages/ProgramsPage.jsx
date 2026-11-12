import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import Modal from "../components/Modal.jsx";

function ProgramForm({ program, onClose, onSaved }) {
  const [title, setTitle] = useState(program?.title ?? "");
  const [description, setDescription] = useState(program?.description ?? "");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api(program ? `/programs/${program.id}/` : "/programs/", {
        method: program ? "PATCH" : "POST",
        body: { title, description },
      });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <Modal title={program ? "Edit program" : "New program"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button className="btn btn-primary">Save</button>
      </form>
    </Modal>
  );
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api("/programs/").then(setPrograms).catch((err) => setError(errorMessage(err)));
  }, []);
  useEffect(load, [load]);

  async function confirmDelete() {
    try {
      await api(`/programs/${deleting.id}/`, { method: "DELETE" });
      setDeleting(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center">
        <h1 className="text-xl font-semibold">Programs</h1>
        <button className="btn btn-primary ml-auto" onClick={() => setForm({})}>
          New program
        </button>
      </div>
      {error && <p role="alert" className="mb-2 text-red-700">{error}</p>}

      <table className="card w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="p-2">Title</th>
            <th className="p-2">Lessons</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {programs.map((p) => (
            <tr key={p.id} className="border-b border-gray-200">
              <td className="p-2">
                <Link className="font-medium underline" to={`/programs/${p.id}`}>
                  {p.title}
                </Link>
                <div className="text-gray-600">{p.description}</div>
              </td>
              <td className="p-2">{p.lessons_count}</td>
              <td className="space-x-2 p-2 text-right">
                <button className="btn" onClick={() => setForm({ program: p })}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => setDeleting(p)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {programs.length === 0 && (
            <tr>
              <td className="p-2 text-gray-600" colSpan={3}>
                No programs yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {form && (
        <ProgramForm
          program={form.program}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            load();
          }}
        />
      )}

      {deleting && (
        <Modal title="Delete program" onClose={() => setDeleting(null)}>
          <p className="mb-3">
            Delete “{deleting.title}”? This will also delete {deleting.lessons_count} lesson(s).
          </p>
          <div className="flex gap-2">
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
            <button className="btn" onClick={() => setDeleting(null)}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
