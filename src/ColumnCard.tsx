import { useState } from "react";
import { AddIcon, ThreeDotsHorizontal } from "./Icons";
import type { Column } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"

export function ColumnCard({ col }: { col: Column }) {

      const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
          id: col.id, 
          data: {
            type: "column",
            col
          }
        });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "bg-neutral-400" : "bg-sky-300"} min-w-68 max-w-68 rounded-md p-2`}
    >
      <div className={`${isDragging ? "opacity-0" : ""}`}>
        <div
          {...attributes}
          {...listeners}
          className="flex justify-between items-center mb-5"
        >
          <div className="text-md font-medium uppercase  pl-4">{col.name}</div>
          <div className=" rounded-md hover:bg-black/20 p-1 inline-block">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
        </div>
        {/* Add Card Input Box... Like in trello */}
        <AddTask></AddTask>
      </div>
    </div>
  );
}

function AddTask() {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <button
        onClick={() => {
        //  setActive(true);
        }}
        className=" w-full min-h-8 pl-2  flex gap-2 items-center  rounded-md hover:bg-black/20 active:bg-black/40 shadow-md active:shadow-sm"
      >
        <AddIcon className="size-4"></AddIcon> Add Task
      </button>
    );
  }
}
