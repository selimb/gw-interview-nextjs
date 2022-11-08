import { createTodo, CreateTodoData, listTodos } from "../../../db";
import { apiRoute } from "../../../utils/api-route";

export default apiRoute({
  async get(req, res) {
    const todos = await listTodos(req.query);
    res.status(200).json(todos);
  },
  async post(req, res) {
    const data = req.body as CreateTodoData;
    const todo = await createTodo(data);
    res.status(201).json(todo);
  },
});
