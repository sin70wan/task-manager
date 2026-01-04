import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  status: Status;
};

type TaskState = {
  tasks: Task[];
  addTask: (title: string) => void;
  moveTask: (id: string, status: Status) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        { id: "1", title: "Prepare Notes", status: "TODO" },
        { id: "2", title: "study", status: "IN_PROGRESS" },
        { id: "3", title: "read", status: "DONE" },
      ],
      addTask: (title) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: Date.now().toString(), title, status: "TODO" },
          ],
        })),
      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        })),
    }),
    { name: "task-manager-storage-v2" }
  )
);
