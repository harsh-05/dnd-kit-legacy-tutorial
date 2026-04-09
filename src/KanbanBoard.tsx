import { useEffect, useMemo, useState } from "react";
import type { Column, Id, Task } from "./types";
import { AddColumn } from "./AddColumn";
import { ColumnCard, ColumnCardPreview } from "./ColumnCard";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export function KanbanBoard() {
  const [column, setColumn] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const colId = useMemo(() => column.map((col) => col.id), [column]);

  const [activeEle, setActiveEle] = useState<Column | null>(null);

  const [colTaskName, setColTaskName] = useState<Task | undefined>(undefined);
  
  useEffect(() => {
    console.log(tasks);
  }, [tasks])

  function generateColumn(name: string) {
    const id = crypto.randomUUID();
    setColumn((prev) => [...prev, { id, name }]);
  }

  function generateTask() {
    if (colTaskName && colTaskName.taskName !== '') {
      setTasks((prev) => [...prev, colTaskName]);
      
    }
    setColTaskName(undefined);
  }

  return (
    <div className="flex items-start gap-2 ">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                generateTask = {generateTask}
              ></ColumnCard>
            );
          })}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeEle && (
              <ColumnCardPreview
                col={activeEle}
                coltaskName={
                  colTaskName?.colId === activeEle.id ? colTaskName : undefined
                }
              ></ColumnCardPreview>
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
      setActiveEle(event.active.data.current?.col);
      return;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
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
}
