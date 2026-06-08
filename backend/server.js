import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(
  session({
    name: "taskflow.sid",
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "taskflow-dev-secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "taskflow_sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "TaskFlow API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
