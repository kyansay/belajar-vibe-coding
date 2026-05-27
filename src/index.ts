import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  .get("/", () => ({
    status: "ok",
    message: "Server is running smoothly with ElysiaJS and Bun!",
  }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return {
        success: true,
        data: allUsers,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch users from database. Make sure MySQL is running.",
        error: error.message,
      };
    }
  })
  .listen(3000);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
