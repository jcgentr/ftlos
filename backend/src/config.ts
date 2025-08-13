import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const EMAIL_REDIRECT_URL = process.env.EMAIL_REDIRECT_URL || process.env.FRONTEND_URL;
