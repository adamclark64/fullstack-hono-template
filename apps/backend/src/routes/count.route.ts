import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { CountService } from "../services/count.service";
import { Hono, TypedResponse } from "hono";
import { Count } from "../database/schemas/count.schema";
import { RunResult } from "better-sqlite3";

const cs = new CountService();

// must chain methods rather than seperate (preferred for legiblity/scalability) to get FE client typings
// https://github.com/orgs/honojs/discussions/1648#discussioncomment-7482447

// hono preferes no seperate controllers so hit service directly route files
// https://hono.dev/guides/best-practices#don-t-make-controllers-when-possible
export const countRouter = new Hono()
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        ip: z.string(),
        id: z.string(),
      }),
    ),
    async (c): Promise<Response> => {
      const { ip, id } = c.req.valid("form");
      // console.log('countData', countData)
      const res = await cs.insert({ ip, id });
      console.log("res: ", res);
      // Set HTTP status code
      c.status(201);
      return c.body("success");
    },
  )
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        ip: z.string(),
      }),
    ),
    async (c): Promise<TypedResponse<Count>> => {
      const countData = c.req.valid("query");
      // console.log('::::', JSON.stringify(countData.ip))
      const countRes = await cs.getByIp(countData.ip);
      console.log("countRes: ,", countRes);
      return c.json(countRes[0]);
    },
  )
  .delete("/:id", async (c): Promise<Response> => {
    try {
      const id = c.req.param("id");
      await cs.resetCounter(id);
      c.status(201);
      return c.body("success");
    } catch (error) {
      console.error(error);
      throw new Error("an error occured resetting counter. please try agian");
    }
  });
