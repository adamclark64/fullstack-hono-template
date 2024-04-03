import { eq } from "drizzle-orm";
import { db } from "../database";
import { Count, CountInsertData, count } from "../database/schemas/count.schema";
import { v4 } from "uuid";
import Database from "better-sqlite3";

export class CountService {
  constructor() {}

  /**
   *
   * @param data
   * @returns db result
   * @description get old record and increment `count`
   */
  async insert(data: CountInsertData) {
    // console.log('data.id: ', data.id)
    const existingRecord = await db
      .select()
      .from(count)
      .where(eq(count.id, data.id));
      if (!existingRecord) {
        throw new Error(`existing record not found for id: ${data.id}`)
      }
    // console.log('record: ', record[0]!.count)
    const countplus = (existingRecord[0]!.count += 1);
    // console.log('countplus: ', countplus)
    return await db
      .update(count)
      .set({ count: countplus })
      .where(eq(count.id, data.id));
  }

  async getByIp(ip: string): Promise<Database.RunResult | Count[]> {
    // console.log('ip: ', ip)
    // return await db.select().from(count).where(eq(count.ip, ip))
    const existing = await db
      .selectDistinct()
      .from(count)
      .where(eq(count.ip, ip));
    // console.log("existing: ", existing);
    if (existing.length) {
      return existing;
    } else {
      const newRecord = await db.insert(count).values({ ip, id: v4(), count: 0 });
      return newRecord
    }
  }

  async resetCounter(id: string) {
    return await db.update(count).set({ count: 0 }).where(eq(count.id, id));
  }
}
