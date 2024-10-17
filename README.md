# YATA (Yet Another To-Do App)

## Setup

1. Clone the repo.
2. `npm install`
3. `npm run dev`

You should now be able to navigate to `localhost:3000` and be greeted with a blank page, or `localhost:3000/api/todos` to fetch the list of todos through the API.

## Project Overview

A backend is run as part of the same project: a simple database can be found in `src/db.ts`, and API endpoints are in `src/pages/api/todos/*`.
Functions to interact with this API can be found in `src/api.ts`.
You can test them out with `npm run test-api`.
Feel free to edit the `main` code in `scripts/test-api.ts` if you want to experiment with the API.

### Disclaimer

This is a very old (in JS time scales) repo, which predates the React Server Components era.

## Tasks

Your task is to write a simple to-do app, with a design similar to https://todomvc.com/examples/typescript-react/#/.

You'll be doing all of your work in the home page (`src/pages/index.tsx`).

1. Decide on a CSS framework (or lack thereof).
2. List all todos (either client-side or in `getServerSideProps`).
3. Allow deleting todos.
4. Allow creating new todos.
5. Allow editing todos.

We're mostly interested in your thought process, and the goal isn't to have a robust production-ready app.
However, you're encouraged to point out things that you'd want to improve if you had more time.
Here are some recommended shortcuts:

- Use the provided `reloadPage` to reload the page after deleting/creating/editing todos so that the list is refreshed.
- Skip error handling.
- Feel free to extract out functionality (components, hooks, etc...) if it helps you, but it's not required.

## Talking Points

- What improvements would you make for a real app?
- When would you use `getServerSideProps` vs. client-side data-fetching.
  Have you heard of the new data-fetching patterns with async react components and nextjs 13?
- How would you handle pagination? Use pseudo-code.
- Why or when would you reach for a global state management solution like Redux.
