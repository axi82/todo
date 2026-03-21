import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import "./App.css";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

function createId(): string {
  return crypto.randomUUID();
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: createId(), text, done: false }]);
    setDraft("");
  }, [draft]);

  const toggle = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const visible = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const activeCount = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Todos</h1>
        <p className="app__subtitle">In-memory — refresh clears the list</p>
      </header>

      <div className="composer">
        <input
          className="composer__input"
          type="text"
          placeholder="What needs doing?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="New todo"
        />
        <button type="button" className="composer__add" onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="filters" role="group" aria-label="Filter todos">
        {(
          [
            ["all", "All"],
            ["active", "Active"],
            ["completed", "Done"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={
              filter === value ? "filters__btn filters__btn--active" : "filters__btn"
            }
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {todos.length === 0 ? (
        <p className="empty">No todos yet. Add one above.</p>
      ) : (
        <ul className="list">
          {visible.map((todo) => (
            <li key={todo.id} className="list__item">
              <label className="list__label">
                <input
                  className="list__check"
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggle(todo.id)}
                />
                <span className={todo.done ? "list__text list__text--done" : "list__text"}>
                  {todo.text}
                </span>
              </label>
              <button
                type="button"
                className="list__remove"
                onClick={() => remove(todo.id)}
                aria-label={`Remove ${todo.text}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <footer className="footer">
          <span>
            {activeCount} active
            {activeCount === 1 ? "" : "s"}
          </span>
          <span>{todos.length} total</span>
        </footer>
      )}
    </div>
  );
}
