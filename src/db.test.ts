import {
  createTodo,
  CreateTodoData,
  deleteTodo,
  INITIAL_DATA,
  listTodos,
  resetTodos,
  updateTodo,
} from "./db";

beforeEach(resetTodos);

test("db is a good enough db", async () => {
  // list
  let todos = await listTodos();
  expect(todos).toEqual(INITIAL_DATA);

  // delete
  await deleteTodo(todos[0].id);
  let expected = todos.slice(1);
  todos = await listTodos();
  expect(todos).toEqual(expected);

  // create
  const data: CreateTodoData = { text: "new", status: "active" };
  const todoNew = await createTodo(data);
  expect(todoNew).toEqual({ id: expect.any(String), ...data });
  expected = todos.concat([todoNew]);
  todos = await listTodos();
  expect(todos).toEqual(expected);

  // update
  const dataUpdate = { text: "new2" };
  const todoUpdated = await updateTodo(todoNew.id, dataUpdate);
  expect(todoUpdated).toEqual({ ...todoNew, ...dataUpdate });
  Object.assign(expected[expected.length - 1], todoUpdated);
  todos = await listTodos();
  expect(todos).toEqual(expected);

  // update non-existing
  expect(await updateTodo("doesnotexist", {})).toBeNull();
});

test("filters", async () => {
  let todos = await listTodos({ text: "TRASH" });
  expect(todos).toEqual([INITIAL_DATA[0]]);

  todos = await listTodos({ status: "done" });
  expect(todos).toEqual([INITIAL_DATA[1]]);

  todos = await listTodos({ text: "TRASH", status: "done" });
  expect(todos).toEqual([]);
  todos = await listTodos({ text: "TRASH", status: "active" });
  expect(todos).toEqual([INITIAL_DATA[0]]);
});
