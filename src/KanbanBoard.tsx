import { useState } from "react";
import type { Column } from "./types";
import { AddColumn } from "./AddColumn";
import { ColumnCard } from "./ColumnCard";

export function KanbanBoard() {
    const [column, setColumn] = useState<Column[]>([]);

    function generateColumn(name: string) {
        const id = crypto.randomUUID();
        setColumn((prev) => ([...prev, {id, name}]))
    }

    return (
        <div className="flex items-start gap-2 ">
            {column.map((col:Column) => {
                return <ColumnCard col= {col}></ColumnCard>
            })}
            
            <AddColumn handleColumnAdd={generateColumn}>{ }</AddColumn>
      </div>
    );
}


