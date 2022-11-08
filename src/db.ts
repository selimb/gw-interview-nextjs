import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export type TodoStatus = "active" | "done";

export type Todo = {
  id: string;
  text: string;
  status: TodoStatus;
};

export type CreateTodoData = Omit<Todo, "id">;
export type UpdateTodoData = Partial<CreateTodoData>;

let DB_PATH = path.join(
  process.cwd(),
  process.env.NODE_ENV === "test" ? "db.test.json" : "db.json"
);
const ENCODING = "utf-8";

export const INITIAL_DATA: Todo[] = [
  { id: crypto.randomUUID(), text: "Take out trash", status: "active" },
  { id: crypto.randomUUID(), text: "Walk dog", status: "done" },
];

export type ListTodosParams = {
  text?: string;
  status?: TodoStatus;
};

export async function listTodos(where: ListTodosParams = {}): Promise<Todo[]> {
  const todos = await load();
  return todos.filter((todo) => {
    let ok = true;
    if (where.text) {
      ok = ok && todo.text.toLowerCase().includes(where.text.toLowerCase());
    }
    if (where.status) {
      ok = ok && todo.status === where.status;
    }
    return ok;
  });
}

export async function createTodo(data: CreateTodoData): Promise<Todo> {
  const todo = { ...data, id: crypto.randomUUID() };
  const todos = await load();
  todos.push(todo);
  await save(todos);
  return todo;
}

export async function updateTodo(
  id: Todo["id"],
  data: UpdateTodoData
): Promise<Todo | null> {
  const todos = await load();
  for (const todo of todos) {
    if (todo.id === id) {
      const todoUpdated = Object.assign(todo, data);
      await save(todos);
      return todoUpdated;
    }
  }
  return null;
}

export async function deleteTodo(id: Todo["id"]): Promise<void> {
  const todosPrev = await load();
  const todosNew = todosPrev.filter((todo) => todo.id !== id);
  await save(todosNew);
}

export async function resetTodos(): Promise<void> {
  await fs.rm(DB_PATH, { force: true });
}

async function save(todos: Todo[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(todos, null, 2), {
    encoding: ENCODING,
  });
}

async function load(): Promise<Todo[]> {
  try {
    var raw = await fs.readFile(DB_PATH, { encoding: ENCODING });
  } catch (error) {
    return INITIAL_DATA;
  }
  return JSON.parse(raw);
}
