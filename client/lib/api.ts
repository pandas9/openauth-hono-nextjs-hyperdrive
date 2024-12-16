import { Routes } from "server/validator";
import { hc } from "hono/client";
import { authFetch } from "./utils";

const serverApi = hc<Routes>(`${process.env.NEXT_PUBLIC_API_URL}`, {
  fetch: authFetch,
});

export { serverApi };
