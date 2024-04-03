import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from ".";

const runMigrations = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "./src/database/migrations",
    });
  } catch (error) {
    console.log("error: ", error);
  }

  console.log("Migrations complete");
};

runMigrations();
