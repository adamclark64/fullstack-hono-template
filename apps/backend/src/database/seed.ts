import { db } from ".";
import { log } from "./schemas/log.schema";

// simple seed ex
db.insert(log)
  .values([
    {
      id: "123-1324",
      ip: "867.5309",
      ts: "bad date :/",
    },
  ])
  .then((res) => {
    console.log("res: ", res);
    console.log(`Seeding complete.`);
  });

// $ tsx src/database/seed.ts
