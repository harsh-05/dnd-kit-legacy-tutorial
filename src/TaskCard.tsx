import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "./types";
import { CSS } from "@dnd-kit/utilities";

export function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` ${isDragging ? "bg-neutral-400" : " bg-neutral-100"} w-full min-h-12 rounded-md mt-2 flex flex-col justify-center`}
    >
      <div
        className={`${isDragging ? "opacity-0" : ""}`}
        {...attributes}
        {...listeners}
      >
        <div className="ml-2">{task.taskName}</div>
      </div>
    </div>
  );
}



export function TaskCardPreview({ task }: {task: Task}) {
  return (
    <div
      
      className={`w-full min-h-12 rounded-md bg-neutral-100 mt-2 flex flex-col justify-center`}
    >
      <div className="ml-2">{task.taskName}</div>
    </div>
  );
}
