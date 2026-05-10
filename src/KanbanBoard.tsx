import { useEffect, useMemo, useState } from "react";
import type { Column, DraftTask, Id, Task } from "./types";
import { AddColumn } from "./AddColumn";
import { ColumnCard, ColumnCardPreview } from "./ColumnCard";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DroppableContainer,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCardPreview } from "./TaskCard";
import { generateKeyBetween } from "fractional-indexing";

export function KanbanBoard() {
  const [column, setColumn] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const colId = useMemo(() => column.map((col) => col.id), [column]);

  type ActiveElement =
    | { type: "column"; element: Column }
    | { type: "task"; element: Task }
    | null;

  const [activeEle, setActiveEle] = useState<ActiveElement>(null);

  const [colTaskName, setColTaskName] = useState<DraftTask | undefined>(
    undefined,
  );

  useEffect(() => {
    tasks.map((task) => console.log(task.rank));
  }, [tasks]);

  function tasksByCOlumn(colId: Id) {
    return tasks
      .filter((task) => task.colId === colId)
      .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0));
  }

  function generateColumn(name: string) {
    const id = crypto.randomUUID();
    setColumn((prev) => [...prev, { id, name }]);
  }

  function generateTask() {
    if (colTaskName && colTaskName.taskName !== "") {
      const tasks = tasksByCOlumn(colTaskName?.colId);
      const lastTask = tasks[tasks.length - 1];
      const rank = generateKeyBetween(lastTask?.rank ?? null, null);
      setTasks((prev) => [...prev, { ...colTaskName, rank }]);
    }
    setColTaskName(undefined);
  }

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(pointerSensor, touchSensor);

  return (
    <div className="flex items-start gap-2 h-full overflow-x-auto">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={kanbanCollisionDetection}
        sensors={sensors}
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
     const { active, over } = event;
     if (!over) return;
     if (active.data.current?.type !== "task") return;

     let targetColId: Id;
     if (over.data.current?.type === "task") {
       // over.data is also a snapshot — but for non-active tasks it's reliable
       // since handleDragOver only mutates the active task's colId
       targetColId = over.data.current.task.colId;
     } else if (over.data.current?.type === "column") {
       targetColId = over.id as Id;
     } else {
       return;
     }

     // Use setTasks with a function so we can check live state inside
     setTasks((prev) => {
       const liveActiveTask = prev.find((t) => t.id === active.id);
       // Only update if the task is actually moving to a NEW column
       if (!liveActiveTask || liveActiveTask.colId === targetColId) return prev;

       return prev.map((t) =>
         t.id === active.id ? { ...t, colId: targetColId } : t,
       );
     });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveEle(null);
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // ── Column reordering (unchanged) ───────────────────────────────────────
    if (
      activeType === "column" &&
      overType === "column" &&
      active.id !== over.id
    ) {
      setColumn((cols) => {
        const oldIndex = cols.findIndex((c) => c.id === active.id);
        const newIndex = cols.findIndex((c) => c.id === over.id);
        return arrayMove(cols, oldIndex, newIndex);
      });
      return;
    }

    // ── Task reordering ──────────────────────────────────────────────────────
    if (activeType !== "task") return;
    if (active.id === over.id) return; // Dropped on itself — nothing to do

    setTasks((prev) => {
      // The ORIGINAL column (before any handleDragOver mutation) lives here.
      // active.data is a snapshot from drag start and never changes during drag.
      const originalColId = active.data.current?.task.colId as Id;

      // Determine target column and which task we're dropping near
      let targetColId: Id;
      let overTaskId: Id | null = null;

      if (overType === "task") {
        // For the over task, look it up in live state — its colId may have
        // shifted if it was previously moved by handleDragOver (shouldn't happen
        // normally, but this is defensive)
        const liveOverTask = prev.find((t) => t.id === over.id);
        if (!liveOverTask) return prev;
        targetColId = liveOverTask.colId;
        overTaskId = over.id as Id;
      } else if (overType === "column") {
        targetColId = over.id as Id;
      } else {
        return prev;
      }

      // Sorted tasks in the target column, EXCLUDING the active task.
      // We exclude it because we're computing where to re-insert it.
      const colTasks = prev
        .filter((t) => t.colId === targetColId && t.id !== active.id)
        .sort((a, b) => (a.rank < b.rank ? -1 : 1));

      let rankAbove: string | null;
      let rankBelow: string | null;

      if (overTaskId !== null) {
        // We landed on a specific task — find its index in the sorted column
        const overIndex = colTasks.findIndex((t) => t.id === overTaskId);

        if (overIndex === -1) {
          // Safety: over task not found (shouldn't happen, but append to end)
          const last = colTasks[colTasks.length - 1];
          return prev.map((t) =>
            t.id === active.id
              ? {
                  ...t,
                  colId: targetColId,
                  rank: generateKeyBetween(last?.rank ?? null, null),
                }
              : t,
          );
        }

        // Is this a same-column reorder or a cross-column transfer?
        const isSameColumn = originalColId === targetColId;

        if (isSameColumn) {
          // We need to know the original index of the active task to determine
          // whether it's moving UP or DOWN the column.
          // We look at ALL tasks in the column (including active) sorted by rank.
          const allColTasks = prev
            .filter((t) => t.colId === targetColId)
            .sort((a, b) => (a.rank < b.rank ? -1 : 1));

          const originalIndex = allColTasks.findIndex(
            (t) => t.id === active.id,
          );
          // overIndex here is in colTasks (excluding active), so we look up
          // the over task's index in the full list for a fair comparison
          const overIndexInFull = allColTasks.findIndex(
            (t) => t.id === overTaskId,
          );

          if (originalIndex < overIndexInFull) {
            // ── Moving DOWN ──────────────────────────────────────────────────
            // Place AFTER the over task.
            // rankAbove = the over task itself
            // rankBelow = the task after it (or null if it's the last task)
            rankAbove = colTasks[overIndex].rank;
            rankBelow = colTasks[overIndex + 1]?.rank ?? null;
          } else {
            // ── Moving UP ────────────────────────────────────────────────────
            // Place BEFORE the over task.
            // rankAbove = the task before it (or null if it's the first task)
            // rankBelow = the over task itself
            rankAbove = colTasks[overIndex - 1]?.rank ?? null;
            rankBelow = colTasks[overIndex].rank;
          }
        } else {
          // ── Cross-column drag ────────────────────────────────────────────
          // No "up vs. down" concept — insert before the over task by default.
          rankAbove = colTasks[overIndex - 1]?.rank ?? null;
          rankBelow = colTasks[overIndex].rank;
        }
      } else {
        // ── Dropped directly on a column ─────────────────────────────────────
        // Either an empty column or the user dragged below all tasks.
        // Append to the end of whatever is already there.
        const lastTask = colTasks[colTasks.length - 1] ?? null;
        rankAbove = lastTask?.rank ?? null;
        rankBelow = null;
      }

      const newRank = generateKeyBetween(rankAbove, rankBelow);

      return prev.map((t) =>
        t.id === active.id ? { ...t, colId: targetColId, rank: newRank } : t,
      );
    });
  }

  function kanbanCollisionDetection(args: any) {
    const { active, droppableContainers } = args;
    const colActive = active.data.current?.type === "column";

    if (colActive) {
      const columnContainers = droppableContainers.filter(
        (c: DroppableContainer) => c.data.current?.type === "column",
      );
      return closestCenter({ ...args, droppableContainers: columnContainers });
    }

    const taskContainers = droppableContainers.filter(
      (c: DroppableContainer) => c.data.current?.type === "task",
    );

    const taskContainersCollision = rectIntersection({
      ...args,
      droppableContainers: taskContainers,
    });

    if (taskContainersCollision.length > 0) {
      return taskContainersCollision;
    }

    const columnContainers = droppableContainers.filter(
      (c: DroppableContainer) => c.data.current?.type === "column",
    );

    return rectIntersection({ ...args, droppableContainers: columnContainers });
  }
}
