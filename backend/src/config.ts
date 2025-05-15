// src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
export const PORT = process.env.PORT || 3001;
