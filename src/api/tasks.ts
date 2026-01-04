import type { Task } from "../store/useTaskStore";

export const fetchTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: "1", title: "Prepare Notes", status: "TODO" },
          { id: "2", title: "Study ", status: "IN_PROGRESS" },
          { id: "3", title: "Read", status: "DONE" },
        ]),
      500
    )
  );
};
