import { api } from "@/lib/axios";

const createKanbanBoard = async () => {
  await api.post("/kanban/board");
};

export { createKanbanBoard };
