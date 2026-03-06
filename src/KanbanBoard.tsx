import { useState } from "react";
import type { Column } from "./types";
import { AddColumn } from "./AddColumn";

export function KanbanBoard() {
    const [column, setColumn] = useState<Column[]>([]);

    function generateColumn(name: string) {
        const id = crypto.randomUUID();
        setColumn((prev) => ([...prev, {id, name}]))
    }

    return (
        <div className="flex gap-2 ">
            {column.map((col:Column) => {
                return <div key={col.id} className="min-w-68 max-w-68 min-h-12 bg-neutral-100">
                    { col.name}
                </div>
            })}
            
            <AddColumn handleColumnAdd={generateColumn}>{ }</AddColumn>
      </div>
    );
}


