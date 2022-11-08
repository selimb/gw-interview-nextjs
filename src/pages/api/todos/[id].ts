import { deleteTodo, updateTodo, UpdateTodoData } from "../../../db";
import { apiRoute } from "../../../utils/api-route";

export default apiRoute({
  async patch(req, res) {
    const id = req.query.id as string;
    const data = req.body as UpdateTodoData;

    const todo = await updateTodo(id, data);
    if (!todo) {
      res.status(404).json({ detail: "No todo with that id." });
    } else {
      res.status(200).json(todo);
    }
  },
  async delete(req, res) {
    const id = req.query.id as string;

    await deleteTodo(id);

    res.status(200).end();
  },
});
