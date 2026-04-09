import type { Task } from "./types";

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="w-full min-h-12 rounded-md bg-neutral-100 mt-2 flex flex-col justify-center">
      <div className="ml-2">{task.taskName}</div>
    </div>
  );
}
