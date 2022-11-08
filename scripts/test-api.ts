/**
 * Run me with `npm run test-api`.
 * Make sure `npm run dev` is running in a separate terminal.
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { BackendApiClient } from "../src/api";

const PORT = Number(process.env["PORT"] || "3000");
const api = new BackendApiClient({ baseURL: `http://localhost:${PORT}` });

async function main() {
  console.info("createTodo");
  const todoNew = await api.createTodo({ text: "new todo", status: "active" });

  console.info("listTodos");
  const todos = await api.listTodos();

  console.info("updateTodo");
  await api.updateTodo(todoNew.id, {
    text: "new todo updated",
    status: "done",
  });

  console.info("deleteTodo");
  await api.deleteTodo(todoNew.id);
}

function indent(text: string, numSpaces = 4) {
  const prefix = " ".repeat(numSpaces);
  return text
    .split("\n")
    .map((line) => prefix + line)
    .join("\n");
}

function formatRequest(req: AxiosRequestConfig) {
  const lines = [`${req.method?.toUpperCase() ?? ""} '${req.url ?? ""}'`];
  if (req.params) {
    lines.push("Params:");
    lines.push(JSON.stringify(req.params, null, 2));
  }
  if (req.data) {
    lines.push("Data:");
    lines.push(JSON.stringify(req.data, null, 2));
  }
  return lines.join("\n");
}

function formatResponse(res: AxiosResponse) {
  const lines = [`${res.status} ${res.statusText}`];
  if (res.data) {
    lines.push("");
    lines.push(JSON.stringify(res.data, null, 2));
  }
  return lines.join("\n");
}

api.axios.interceptors.request.use((config) => {
  console.info(`Request:\n${indent(formatRequest(config))}\n`);
  return config;
});

api.axios.interceptors.response.use(
  function success(response) {
    console.info(`Response\n${indent(formatResponse(response))}\n`);
    return response;
  },
  async function error(error): Promise<never> {
    if (axios.isAxiosError(error) && error.request) {
      if (error.response) {
        console.error(
          `Got error response:\n${indent(formatResponse(error.response))}`
        );
      } else {
        console.error(`Failed request: ${error.message}`);
      }
    }
    return Promise.reject(error);
  }
);

void main();
