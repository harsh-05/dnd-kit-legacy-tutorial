import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { AddIcon, ThreeDotsHorizontal } from "./Icons";
import type { Column, Id, Task } from "./types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useOnClickOutside } from "./useOnClickOutside";
import { TaskCard } from "./TaskCard";

export function ColumnCard({
  col,
  setColTaskName,
  coltaskName,
  generateTask,
  tasks,
}: {
  col: Column;
  setColTaskName?: Dispatch<SetStateAction<Task | undefined>>;
  coltaskName?: Task | undefined;
  generateTask: () => void;
  tasks: Task[];
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

  const taskIds = useMemo(() => { return tasks.map((task) => task.id) }, [tasks]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
      ${isDragging ? "bg-neutral-400" : "bg-neutral-200"} 
      min-w-68 max-w-68 max-h-full min-h-0 flex flex-col rounded-md p-2 `}
    >
      <div
        className={`${isDragging ? "opacity-0" : ""} h-full flex flex-col min-h-0`}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex justify-between items-center mb-5 "
        >
          <div className="text-md font-medium uppercase  pl-4 wrap-break-word min-w-0">
            {col.name}
          </div>
          <div className=" rounded-md hover:bg-black/20 p-1 ">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
        </div>

        {/* Displaying the tasks here... */}
        <div className="flex flex-col  flex-1 min-h-0 overflow-y-auto  ">
          <SortableContext items={taskIds}>
            {tasks.map((task) => {
              return <TaskCard key={task.id} task={task}></TaskCard>;
            })}
          </SortableContext>
        </div>

        {/* Add Card Input Box... Like in trello */}
        <AddTask
          colTaskName={coltaskName}
          setColTaskName={setColTaskName}
          col={col}
          isDragging={isDragging}
          generateTask={generateTask}
        ></AddTask>
      </div>
    </div>
  );
}

export function ColumnCardPreview({
  col,
  coltaskName,
  tasks,
}: {
  col: Column;
  coltaskName?: Task | undefined;
  tasks: Task[];
}) {
  return (
    <div className="bg-neutral-200 min-w-68 max-w-68 max-h-full flex flex-col rounded-md p-2 opacity-80 ">
      <div className="flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-5">
          <div className="text-md font-medium uppercase  pl-4 min-w-0 wrap-break-word">
            {col.name}
          </div>
          <div className=" rounded-md hover:bg-black/20 p-1 inline-block">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
        </div>

        <div className="flex flex-col  min-h-0 flex-1 overflow-y-hidden ">
          {tasks.map((task) => {
            return <TaskCard key={task.id} task={task}></TaskCard>;
          })}
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
  isDragging = false,
  generateTask,
}: {
  col?: Column;
  isPreview?: boolean;
  colTaskName: Task | undefined;
  setColTaskName?: Dispatch<SetStateAction<Task | undefined>>;
  isDragging?: boolean;
  generateTask?: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useOnClickOutside(ref, () => {
    if (colTaskName && !isPreview && setColTaskName && generateTask) {
      generateTask();
      setColTaskName(undefined);
    }
  });

  if (!colTaskName) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (col && setColTaskName)
            setColTaskName({
              id: crypto.randomUUID(),
              taskName: "",
              colId: col.id,
            });
        }}
        className=" shrink-0 w-full min-h-8 pl-2 mt-2  flex gap-2 items-center  rounded-md hover:bg-black/20 active:bg-black/40 shadow-md active:shadow-sm"
      >
        <AddIcon className="size-4"></AddIcon> Add Task
      </button>
    );
  } else {
    return (
      <textarea
        ref={ref}
        value={colTaskName?.taskName}
        onKeyDown={(e) => {
          if (e.key === "Enter" && generateTask) {
            e.preventDefault();
            generateTask();
          }
        }}
        onChange={(e) => {
          if (setColTaskName && !isPreview && col)
            setColTaskName((prev) =>
              prev ? { ...prev, taskName: e.target.value } : prev,
            );
        }}
        className="shrink-0 w-full bg-neutral-50 min-h-8 max-h-32 mt-2 pl-2 pr-4 pb-4 pt-2 resize-none focus:outline-none rounded-md shadow-md
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
