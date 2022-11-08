import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { CreateTodoData, ListTodosParams, Todo, UpdateTodoData } from "./db";

export class BackendApiClient {
  public readonly axios: AxiosInstance;

  constructor(config?: Pick<CreateAxiosDefaults, "baseURL">) {
    this.axios = axios.create(config);
  }

  async listTodos(params?: ListTodosParams): Promise<Todo[]> {
    const r = await this.axios.request({
      method: "get",
      url: "/api/todos",
      params,
    });
    return r.data;
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    const r = await this.axios.request({
      method: "post",
      url: "/api/todos",
      data,
    });
    return r.data;
  }

  async updateTodo(id: string, data: UpdateTodoData): Promise<Todo> {
    const r = await this.axios.request({
      method: "patch",
      url: `/api/todos/${id}`,
      data,
    });
    return r.data;
  }

  async deleteTodo(id: string): Promise<void> {
    await this.axios.request({ method: "delete", url: `/api/todos/${id}` });
  }
}

export const api = new BackendApiClient();
