import { Elysia } from "elysia";
import { registerUser, loginUser } from "../services/users-service";

export const usersRoute = new Elysia()
  .post("/api/users", async ({ body, set }) => {
    try {
      const result = await registerUser(body);
      return {
        success: true,
        data: result,
        message: "User created successfully",
      };
    } catch (error: any) {
      set.status = 400;
      return {
        error: error.message,
      };
    }
  })
  .post("/api/login", async ({ body, set }) => {
    try {
      const data = await loginUser(body);
      return {
        data: data,
      };
    } catch (error: any) {
      // Mengubah status HTTP menjadi 401 jika terjadi kegagalan autentikasi
      set.status = 401;
      return {
        error: error.message,
      };
    }
  });
