export type Id = string | number;

export type Column = {
    id: Id,
    name: string,
}

export type Task = {
    id: Id,
    taskName: string,
    colId: Id
}