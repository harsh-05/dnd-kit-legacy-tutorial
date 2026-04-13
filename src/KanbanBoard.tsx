import { useEffect, useMemo, useState } from "react";
import type { Column, Id, Task } from "./types";
import { AddColumn } from "./AddColumn";
import { ColumnCard, ColumnCardPreview } from "./ColumnCard";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCardPreview } from "./TaskCard";

export function KanbanBoard() {
  const [column, setColumn] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const colId = useMemo(() => column.map((col) => col.id), [column]);

  type ActiveElement =
    | { type: "column"; element: Column }
    | { type: "task"; element: Task }
    | null;

  const [activeEle, setActiveEle] = useState<ActiveElement>(null);

  const [colTaskName, setColTaskName] = useState<Task | undefined>(undefined);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  function generateColumn(name: string) {
    const id = crypto.randomUUID();
    setColumn((prev) => [...prev, { id, name }]);
  }

  function generateTask() {
    if (colTaskName && colTaskName.taskName !== "") {
      setTasks((prev) => [...prev, colTaskName]);
    }
    setColTaskName(undefined);
  }


  return (
    <div className="flex items-start gap-2 h-full overflow-x-auto">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={kanbanCollisionDetection}
      >
        <SortableContext items={colId}>
          {column.map((col: Column) => {
            return (
              <ColumnCard
                key={col.id}
                col={col}
                coltaskName={
                  colTaskName?.colId === col.id ? colTaskName : undefined
                }
                setColTaskName={setColTaskName}
                generateTask={generateTask}
                tasks={tasks.filter((task) => task.colId === col.id)}
              ></ColumnCard>
            );
          })}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeEle && activeEle.type === "column" && (
              <ColumnCardPreview
                col={activeEle.element}
                coltaskName={
                  colTaskName?.colId === activeEle.element.id
                    ? colTaskName
                    : undefined
                }
                tasks={tasks.filter(
                  (task) => task.colId === activeEle.element.id,
                )}
              ></ColumnCardPreview>
            )}

            {activeEle && activeEle.type === "task" && (
              <TaskCardPreview task={activeEle.element}></TaskCardPreview>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <AddColumn
        generateColumn={generateColumn}
        onOpen={() => {
          generateTask();
        }}
      ></AddColumn>
    </div>
  );

  function handleDragStart(event: DragStartEvent) {
    console.log(event);
    if (event.active.data.current?.type === "column") {
      setActiveEle({ type: "column", element: event.active.data.current?.col });
      return;
    }
     if (event.active.data.current?.type === "task") {
      setActiveEle({ type: "task", element: event.active.data.current?.task });
      return;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    console.log(event.active.data.current?.type);
    console.log(event.over?.data.current?.type);

   
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log(over?.data.current?.type);
    if (over)
      if (active.id !== over.id) {
        setColumn((cols) => {
          const oldIndex = cols.findIndex((object) => object.id === active.id);
          const newIndex = cols.findIndex((object) => object.id === over.id);
          return arrayMove(cols, oldIndex, newIndex);
        });
      }

    setActiveEle(null);
  }


  function kanbanCollisionDetection(args: any) {
    const { active, droppableContainers } = args;
    
    if (active.data.current?.type === "column") {
      const collisions = closestCenter(args);

      const collisionIds = new Set(
          droppableContainers.filter((c:any)=>c.data.current?.type === 'column').map((c:any)=>c.id)
      )

      return collisions.filter((collision: any) => {
            return collisionIds.has(collision.id)
      });
    }

    const pointerCollision = pointerWithin(args);
    
    if (pointerCollision.length > 0) return pointerCollision;

    return closestCorners(args);
  }
  
}
