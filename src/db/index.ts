import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "mysql://root:password@127.0.0.1:3306/vibe_db";

export const connection = createPool(connectionString);
export const db = drizzle(connection, { schema, mode: "default" });
