import { db } from "../database";
import { Log, log } from "../database/schemas/log.schema";

export class LogService {
  constructor() {}

  async insert(data: Log) {
    await db.insert(log).values(data).run();
  }

  async getAll() {
    return await db.select().from(log).all();
  }

  async clearLogRecords() {
    // remove all logs records
    return await db.delete(log);
  }
}
