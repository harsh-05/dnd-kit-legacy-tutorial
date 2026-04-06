import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { AddIcon, ThreeDotsHorizontal } from "./Icons";
import type { Column, Id } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useOnClickOutside } from "./useOnClickOutside";

export function ColumnCard({
  col,
  setColTaskName,
  coltaskName,
}: {
  col: Column;
  setColTaskName?: Dispatch<
    SetStateAction<
      | {
          id: Id;
          taskName: string;
        }
      | undefined
    >
  >;
  coltaskName?: { id: Id; taskName: string } | undefined;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: col.id,
    data: {
      type: "column",
      col,
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
      className={`${isDragging ? "bg-neutral-400" : "bg-neutral-200"} min-w-68 max-w-68 rounded-md p-2`}
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
        <AddTask colTaskName={coltaskName} setColTaskName={setColTaskName} col={col} isDragging={isDragging}></AddTask>
      </div>
    </div>
  );
}

export function ColumnCardPreview({
  col,
  coltaskName,
}: {
  col: Column;
  coltaskName?: { id: Id; taskName: string } | undefined;
}) {
  return (
    <div className="bg-neutral-200 min-w-68 max-w-68 rounded-md p-2">
      <div>
        <div className="flex justify-between items-center mb-5">
          <div className="text-md font-medium uppercase  pl-4">{col.name}</div>
          <div className=" rounded-md hover:bg-black/20 p-1 inline-block">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
        </div>
        {/* Add Card Input Box... Like in trello */}
        <AddTask isPreview={true} colTaskName={coltaskName}></AddTask>
      </div>
    </div>
  );
}

function AddTask({
  col,
  isPreview = false,
  colTaskName,
  setColTaskName,
  isDragging = false
}: {
  col?: Column
  isPreview?: boolean;
  colTaskName: { id: Id; taskName: string } | undefined;
  setColTaskName?: Dispatch<
    SetStateAction<
      | {
          id: Id;
          taskName: string;
        }
      | undefined
    >
    >;
  isDragging?: boolean
}) {
  const [active, setActive] = useState(false);

  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    console.log("Active state of add task : " + active + "IsPreview" + isPreview);
  }, [active, isPreview]);

  useOnClickOutside(ref, () => {

    if (colTaskName && setColTaskName) setColTaskName(undefined);
  });

  if (!colTaskName) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if(col && setColTaskName)
            setColTaskName({id: col.id, taskName: ''});
        }}
        className=" w-full min-h-8 pl-2  flex gap-2 items-center  rounded-md hover:bg-black/20 active:bg-black/40 shadow-md active:shadow-sm"
      >
        <AddIcon className="size-4"></AddIcon> Add Task
      </button>
    );
  } else {
    return (
      <textarea
        ref={ref}
        value={colTaskName?.taskName}
        onChange={(e) => {
          if(setColTaskName && !isPreview && col)
            setColTaskName(() => { return {id: col.id, taskName: e.target.value}  });
        }}
        className="w-full bg-neutral-50 min-h-8 max-h-32 pl-2 pr-4 pb-4 pt-2 resize-none focus:outline-none rounded-md shadow-md
         [&::-webkit-scrollbar]:rounded-md
         [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar-track]:rounded-md
          [&::-webkit-scrollbar-track]:bg-zinc-100
           [&::-webkit-scrollbar-thumb]:rounded-md
         [&::-webkit-scrollbar-thumb]:bg-zinc-400
         "
        autoFocus
      ></textarea>
    );
  }
}
