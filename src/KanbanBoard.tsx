import { useMemo, useState } from "react";
import type { Column } from "./types";
import { AddColumn } from "./AddColumn";
import { ColumnCard } from "./ColumnCard";
import { DndContext, DragOverlay, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

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
        <DndContext onDragStart={handleDragStart}>
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
}


