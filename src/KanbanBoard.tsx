import { useMemo, useState } from "react";
import type { Column } from "./types";
import { AddColumn } from "./AddColumn";
import { ColumnCard } from "./ColumnCard";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

export function KanbanBoard() {
  const [column, setColumn] = useState<Column[]>([]);
  const colId = useMemo(() => column.map((col) => col.id), [column]);

  const [activeEle, setActiveEle] = useState<Column | null>(null);

    function generateColumn(name: string) {
        const id = crypto.randomUUID();
        setColumn((prev) => ([...prev, {id, name}]))
    }

    return (
      <div className="flex items-start gap-2 ">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={colId}>
            {column.map((col: Column) => {
              return <ColumnCard key={col.id} col={col}></ColumnCard>;
            })}
          </SortableContext>

          <DragOverlay>
            {activeEle && <ColumnCard col={activeEle}></ColumnCard>}
          </DragOverlay>
          
        </DndContext>

        <AddColumn generateColumn={generateColumn}>{}</AddColumn>
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
    if(over)
    if (active.id !== over.id) {
      setColumn((cols) => {
        const oldIndex = column.findIndex((object => object.id === active.id));
        const newIndex = column.findIndex((object => object.id === over.id));
        return arrayMove(column, oldIndex, newIndex);
        })
    }
  }
}


