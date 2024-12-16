import { UserRouteType } from "server/validator";
import { hc } from "hono/client";
import { API_V1_PREFIX } from "server/helper";
import { authFetch } from "./utils";

const userApi = hc<UserRouteType>(
  `${process.env.NEXT_PUBLIC_API_URL}${API_V1_PREFIX}/user`,
  {
    fetch: authFetch,
  }
);

export { userApi };
