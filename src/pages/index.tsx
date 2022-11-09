import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../api";

const Home: NextPage = () => {
  const router = useRouter();
  // NOTE: Helper function to reload the page. Useful after making state-changing API calls.
  const reloadPage = () => {
    router.replace(router.asPath);
  };
  // NOTE: React-query is already setup for you.
  // useQuery({queryKey: ["todos"], queryFn: () => api.listTodos() })

  return (
    <div>
      <h1>YATA (Yet Another To-Do App)</h1>
      {/* TODO: Replace me. */}
      <button
        onClick={async () => {
          const todos = await api.listTodos();
          console.info("todos", todos);
        }}
      >
        Load Data
      </button>
    </div>
  );
};

export default Home;
