import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

export default app;
