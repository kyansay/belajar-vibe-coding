import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function registerUser(payload: any) {
  const { name, email, password } = payload;

  // 1. Validasi apakah email sudah terdaftar
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error("email sudah terdaftar");
  }

  // 2. Hashing password menggunakan Bun.password secara native (bcrypt)
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan data user baru ke database
  const [result] = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  const insertId = (result as any).insertId;

  // 4. Ambil data user yang baru disimpan
  const [newUser] = await db.select().from(users).where(eq(users.id, insertId)).limit(1);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    created_at: newUser.createdAt,
  };
}

export async function loginUser(payload: any) {
  const { email, password } = payload;

  // 1. Cari user berdasarkan email
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    throw new Error("kredensial tidak valid");
  }

  // 2. Verifikasi kecocokan password plaintext dengan hash password
  const isPasswordValid = await Bun.password.verify(password, user.password);
  if (!isPasswordValid) {
    throw new Error("kredensial tidak valid");
  }

  return "oke";
}
