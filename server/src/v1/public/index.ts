import { Hono } from "hono";
import { Env } from "../../validator";
import system from "./system";
import upload from "./upload";

const publicRoutes = new Hono<Env>().route("/", system).route("/", upload);

export default publicRoutes;
