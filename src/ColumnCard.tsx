import { useState } from "react";
import { AddIcon, ThreeDotsHorizontal } from "./Icons";
import type { Column } from "./types";

export function ColumnCard({ col }: { col: Column }) {
  return (
    <div className="min-w-68 max-w-68  bg-sky-300 rounded-md p-2">
      <div className="flex justify-between items-center mb-5">
        <div className="text-md font-medium uppercase  pl-4">{col.name}</div>
        <div className=" rounded-md hover:bg-black/20 p-1 inline-block">
          <ThreeDotsHorizontal></ThreeDotsHorizontal>
        </div>
      </div>
      {/* Add Card Input Box... Like in trello */}
      <AddTask></AddTask>
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
        <AddIcon size="4"></AddIcon> Add Task
      </button>
    );
  }
}
