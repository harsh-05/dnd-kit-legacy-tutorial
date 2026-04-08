import type { Task } from "./types";

export function TaskCard({ task } :{task: Task}) {

    return <div className="w-full min-h-12 ">
        <div>
            { task.taskName}
            </div>
     </div>
 }