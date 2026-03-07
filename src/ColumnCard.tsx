import { act, useState } from "react";
import { ThreeDotsHorizontal } from "./Icons";
import type { Column } from "./types";

export function ColumnCard({col}: {col: Column}) {
    return (
      <div className="min-w-68 max-w-68 min-h-48 bg-sky-300 rounded-md p-2">
        <div className="flex justify-between items-center mb-5">
          <div className="text-md font-medium uppercase ">{col.name}</div>
          <div className=" rounded-md hover:bg-black/20 p-1">
            <ThreeDotsHorizontal></ThreeDotsHorizontal>
          </div>
            </div>
            {/* Add Card Input Box... Like in trello */}
            <div>

            </div>
      </div>
    );
}


function AddTask() {
    const [active, setActive] = useState(false);

    if (!active) {
        return <div>

        </div>
    }
}