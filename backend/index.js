import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { loadData } from "./services/dataLoader.js";
import trainingRoute from "./routes/training_route.js";
import classifyRoute from "./routes/classify_route.js";
import questionsRoute from "./routes/questions_route.js";
import aboutRoute from "./routes/about_route.js";
import devplanRoute from "./routes/devplan_route.js";
import chatRoute from "./routes/chat_route.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { cacheMiddleware } from "./utils/cache.js";
import cluster from "cluster";
import os from "os";
import handleDemographic from "./routes/demographic_route.js";
import assistantRoute from "./routes/assistant_route.js";
import multiRaterRoute from "./routes/multi_rater_route.js";
import dashboardRoute from "./routes/dashboard_route.js";
import authRoute from "./routes/auth_route.js";
import cookieParser from "cookie-parser";
import subscriptionRoute from "./routes/subscription_route.js";
import consultantRoute from "./routes/consultant_route.js";
import adminRoute from "./routes/admin_route.js";
import devPlanRouter from "./routes/devplan_route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow requests from the frontend
  optionsSuccessStatus: 200,
  credentials: true, // Important for cookies
};

// Middleware
app.use(cors(corsOptions)); // Use the CORS middleware with our configuration
app.use(helmet());
app.use(express.json());
app.use(compression()); // Add compression
app.use(cookieParser());

// //Cache middleware
// app.use(cacheMiddleware);

// //Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Mount routes
app.use("/api/chat", chatRoute);
app.use("/api/classify", classifyRoute);
app.use("/api/assessment/about", aboutRoute);
app.use("/api/upload-training", trainingRoute);
app.use("/api/assessment/questions", questionsRoute);
app.use("/api/generate-development-plan", devplanRoute);
app.use("/api/assessment/demographic", handleDemographic);
app.use("/api/assistant", assistantRoute);
app.use("/api/multi-rater", multiRaterRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/auth", authRoute);
app.use("/api/subscriptions", subscriptionRoute);
app.use("/api/consultants", consultantRoute);
app.use("/api/admin", adminRoute);
app.use("/api/development-plan", devPlanRouter);

// API documentation route
app.get("/", (req, res) => {
  const apiDocs = {
    "/api/chat": "Chat with the AI",
    "/api/upload-training": "Upload training data",
    "/api/classify": "Classify responsibility level",
    "/api/assessment/questions": "Get all assessment questions",
    "/api/assessment/about":
      "Get all questions about assessment for learn more",
    "/api/assessment/questions/:level": "Get assessment questions by level",
    "/api/assessment/about-questions/:level":
      "Get questions about assessment by level",
    "/api/generate-development-plan": "Generate development plan",
    "/api/assessment/demographic": "Get demographic questions",
    "/api/assistant": "Interact with the AI assistant",
    "/api/multi-rater": "Handle multi-rater assessments",
    "/api/dashboard": "Access dashboard data",
    "/api/auth": "Handle authentication",
    "/api/admin": "Handle admin operations",
    "/api/import-data": "Import assessment data",
    "/api/development-plan": "Handle development plan operations",
  };
  res.json({ apiDocs });
});
// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // Replace the dead worker
  });
} else {
  loadData()
    .then(() => {
      app.listen(port, () => {
        console.log(
          `Worker ${process.pid} started and listening on port ${port}`
        );
      });
    })
    .catch((error) => {
      console.error("Failed to load data:", error);
      console.log("Exiting process");
      process.exit(1);
    });
}
