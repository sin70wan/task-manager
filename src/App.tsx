import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { useTaskStore } from "./store/useTaskStore";
import type { Status, Task } from "./store/useTaskStore";

const COLUMNS: { id: Status; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="cursor-grab break-words whitespace-normal rounded-xl bg-neutral-700 p-5 text-lg text-white shadow-md hover:shadow-xl transition"
    >
      {task.title}
    </div>
  );
}

function Column({
  status,
  title,
  tasks,
}: {
  status: Status;
  title: string;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-full max-w-[360px] rounded-2xl bg-neutral-800 p-6 shadow-xl transition
        ${isOver ? "ring-4 ring-blue-500" : ""}`}
    >
      <h2 className="mb-6 text-center text-2xl font-bold text-white">{title}</h2>

      <div className="flex min-h-[260px] flex-col gap-4 rounded-xl bg-neutral-900 p-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { tasks, addTask, moveTask } = useTaskStore();
  const [title, setTitle] = useState("");

  function handleAddTask() {
    if (!title.trim()) return;
    addTask(title);
    setTitle("");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    moveTask(active.id as string, over.id as Status);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-10">
      <h1 className="mb-10 text-center text-4xl md:text-5xl text-white font-bold">
        Task Manager
      </h1>

      {/* ADD TASK */}
      <div className="mb-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full sm:w-[420px] rounded-xl bg-neutral-800 p-4 text-lg text-white outline-none focus:ring-4 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTask}
          className="rounded-xl border-2 border-blue-400 bg-blue-100 px-6 py-2 text-lg font-semibold text-blue-700 hover:bg-blue-200 transition w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      {/* BOARD */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap justify-center gap-6">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              status={column.id}
              title={column.title}
              tasks={tasks.filter((t) => t.status === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
