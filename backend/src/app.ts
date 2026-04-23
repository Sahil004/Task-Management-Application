import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler, notFound } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { swaggerSpec, swaggerUi } from "./swagger";

dotenv.config();

const app = express();

app.use(helmet());
const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "TaskFlow API Docs",
  }),
);

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

export default app;
