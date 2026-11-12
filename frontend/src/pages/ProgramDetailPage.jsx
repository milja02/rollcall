import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import AssignModal from "../components/AssignModal.jsx";
import LessonForm from "../components/LessonForm.jsx";
import ReplaceModal from "../components/ReplaceModal.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDateTime, formatTime } from "../lib/calendar.js";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [lessonForm, setLessonForm] = useState(null);
  const [assignTo, setAssignTo] = useState(null);
  const [replacing, setReplacing] = useState(null);

  const load = useCallback(async () => {
    try {
      setProgram(await api(`/programs/${id}/`));
      setLessons(await api(`/lessons/?program=${id}`));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);

  async function removeLesson(lesson) {
    if (!window.confirm(`Delete lesson “${lesson.title}”?`)) return;
    try {
      await api(`/lessons/${lesson.id}/`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const done = () => {
    setLessonForm(null);
    setAssignTo(null);
    setReplacing(null);
    load();
  };

  if (!program) {
    return error ? <p role="alert" className="text-red-700">{error}</p> : <p>Loading…</p>;
  }

  return (
    <div>
      <Link to="/programs" className="text-sm underline">
        ← Programs
      </Link>
      <div className="mb-3 mt-2 flex items-center">
        <h1 className="text-xl font-semibold">{program.title}</h1>
        <button className="btn btn-primary ml-auto" onClick={() => setLessonForm({})}>
          Add lesson
        </button>
      </div>
      {error && <p role="alert" className="mb-2 text-red-700">{error}</p>}

      <ul className="space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="card">
            <div className="flex items-start gap-2">
              <div>
                <div className="font-medium">{lesson.title}</div>
                <div className="text-sm text-gray-600">
                  {formatDateTime(lesson.starts_at)} – {formatTime(lesson.ends_at)}
                </div>
              </div>
              <div className="ml-auto space-x-2">
                <button className="btn" onClick={() => setAssignTo(lesson)}>
                  Assign
                </button>
                <button className="btn" onClick={() => setLessonForm({ lesson })}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => removeLesson(lesson)}>
                  Delete
                </button>
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {lesson.assignments.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <span>{a.lecturer.full_name}</span>
                  <StatusBadge status={a.status} />
                  {a.replaced_from && (
                    <span className="text-xs text-gray-500">
                      replaced {a.replaced_from.full_name}: {a.replacement_reason}
                    </span>
                  )}
                  {a.status === "ASSIGNED" && (
                    <button className="btn ml-auto py-0.5" onClick={() => setReplacing(a)}>
                      Replace
                    </button>
                  )}
                </li>
              ))}
              {lesson.assignments.length === 0 && (
                <li className="text-gray-500">No lecturers assigned.</li>
              )}
            </ul>
          </li>
        ))}
        {lessons.length === 0 && <li className="text-gray-600">This program has no lessons yet.</li>}
      </ul>

      {lessonForm && (
        <LessonForm
          programId={program.id}
          lesson={lessonForm.lesson}
          onClose={() => setLessonForm(null)}
          onSaved={done}
        />
      )}
      {assignTo && (
        <AssignModal lesson={assignTo} onClose={() => setAssignTo(null)} onSaved={done} />
      )}
      {replacing && (
        <ReplaceModal assignment={replacing} onClose={() => setReplacing(null)} onSaved={done} />
      )}
    </div>
  );
}
