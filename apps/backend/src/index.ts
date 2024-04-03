import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import * as routes from "./routes";
import { prettyJSON } from "hono/pretty-json";

const port = 3000;
const app = new Hono().basePath("/v1");

// middleware - order matters
app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());

// generic catch
app.onError((err, c) => {
  console.error(`${err} on line ${err.stack}`);
  return c.json(
    {
      status: "error",
      data: null,
      message: `${err} on line ${err.stack}`,
      code: 500,
    },
    500,
  );
});

// generic 404
app.notFound((c) =>
  c.json(
    {
      status: "error",
      data: null,
      message: `Not Found`,
      code: 404,
    },
    404,
  ),
);

// routes
const countRoutes = app.route("/count", routes.countRouter);
const logRoutes = app.route("/log", routes.logRouter);
// export api type for fe client usage
export type AppType = typeof logRoutes | typeof countRoutes;

// start and notify
serve({
  fetch: app.fetch,
  port,
});
console.log(`application started on port ${port} \n routes: `);
showRoutes(app);
