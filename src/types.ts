export type Id = string | number;

export type Column = {
    id: Id,
    name: string,
}

export type DraftTask = {
    id: Id,
    taskName: string,
    colId: Id
}

export type Task = DraftTask & {
        rank: string
}