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
  type DroppableContainer,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCardPreview } from "./TaskCard";
import type { Container } from "react-dom/client";

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
   // Need to improve the logic... Currently working through Poor logic...

    const { active, over } = event;
    console.log(over?.data.current?.type);

    if (active.data.current?.type === "task" && over && active.id !== over?.id) {
      const activeId = active.id;
      const overId = over.id;

      if (over.data.current?.type === "column") {
        const newTasks = tasks.map((task) => {
          if (task.id === activeId) return { ...task, colId: overId };
          return task;
        });
        setTasks(newTasks);
        return;
      }

      if (over.data.current?.type === "task") {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((obj) => obj.id === activeId);
          const overIndex = tasks.findIndex((obj) => obj.id === overId);

          if (tasks[activeIndex].colId !== tasks[overIndex].colId && activeIndex < overIndex) {

            // Direct state mutation is not allowed.... check and change it later
            tasks[activeIndex].colId = tasks[overIndex].colId;
          
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        })
        return;
      }
    }
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log(over?.data.current?.type);
    if (over)
      if (active.id !== over.id && active.data.current?.type === 'column' && over.data.current?.type === 'column')  {
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
    const colActive = active.data.current?.type === 'column';

    if (colActive) {
      const columnContainers = droppableContainers.filter((c: DroppableContainer) => c.data.current?.type === 'column');
      return closestCenter({ ...args, droppableContainers: columnContainers });

    }

    const taskContainers = droppableContainers.filter((c: DroppableContainer) => c.data.current?.type === 'task');

    const taskContainersCollision = rectIntersection({ ...args, droppableContainers: taskContainers });
    console.log(taskContainersCollision)

    if (taskContainersCollision.length > 0) {
      return taskContainersCollision;
    }

    const columnContainers = droppableContainers.filter((c: DroppableContainer) => c.data.current?.type === 'column')

    return closestCenter({...args, droppableContainers :columnContainers});
  }
}
