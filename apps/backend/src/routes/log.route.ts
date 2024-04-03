import { zValidator } from "@hono/zod-validator";
import { LogService } from "../services/log.service";
const { v4 } = require("uuid");
import z from "zod";
import { Hono, TypedResponse } from "hono";
import { Log } from "../database/schemas/log.schema";

const ls = new LogService();

// must chain methods rather than seperate (preferred for legiblity/scalability) to get FE client typings
// https://github.com/orgs/honojs/discussions/1648#discussioncomment-7482447

// hono preferes no seperate controllers so hit service directly route files
// https://hono.dev/guides/best-practices#don-t-make-controllers-when-possible
export const logRouter = new Hono()
  .post(
    "/",
    zValidator(
      "query",
      z.object({
        ts: z.string(),
        ip: z.string(),
      }),
    ),
    async (c): Promise<Response> => {
      const logdata = c.req.valid("query");
      // console.log('logdata', logdata)
      await ls.insert({ ...logdata, id: v4() });
      return c.body("success");
    },
  )
  .get("/", async (c) => {
    const logs = await ls.getAll();
    logs.map((log: Log) => ({ ...log }));
    // console.log('logs: ', logs)
    return c.json(logs);
  })
  .delete("/", async (c): Promise<Response> => {
    await ls.clearLogRecords();
    c.status(201);
    return c.body("success");
  });
