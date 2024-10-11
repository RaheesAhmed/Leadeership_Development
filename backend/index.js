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

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression()); // Add compression

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount routes
app.use("/api/chat", chatRoute);
app.use("/api/classify", classifyRoute);
app.use("/api/assessment/about", aboutRoute);
app.use("/api/upload-training", trainingRoute);
app.use("/api/assessment/questions", questionsRoute);
app.use("/api/generate-development-plan", devplanRoute);
app.use("/api/assessment/demographic", handleDemographic);

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
