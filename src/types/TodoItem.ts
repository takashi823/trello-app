export type TodoStatus = "todo" | "inProgress" | "prepare" | "done";

export type TodoList = {
  [key in TodoStatus]: string[];
};
