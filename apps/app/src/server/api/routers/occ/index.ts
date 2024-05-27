import { createTRPCRouter } from "../../trpc";
import { createOCC } from "./createOCC";

export const occRouter = createTRPCRouter({
  // TODO: move it to worker
  createOCC,
});
