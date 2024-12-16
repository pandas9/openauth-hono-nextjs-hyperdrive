import { Hono } from "hono";
import { Env } from "../../validator";
import test from "./test";
import test2 from "./test2";

const publicRoutes = new Hono<Env>().route("/", test).route("/", test2);

export default publicRoutes;
