import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import athleteRoutes from "./routes/athletes";
import teamRoutes from "./routes/teams";
import sportsRoutes from "./routes/sports";
import ratingsRoutes from "./routes/ratings";
import taglinesRoutes from "./routes/taglines";
import rankingsRoutes from "./routes/rankings";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/taglines", taglinesRoutes);
app.use("/api/rankings", rankingsRoutes);

export default app;
