import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { loadData } from "./utils/dataLoader.js";
import trainingRoute from './routes/training_route.js';
import classifyRoute from './routes/classify_route.js';
import questionsRoute from './routes/questions_route.js';
import aboutRoute from './routes/about_route.js';
import devplanRoute from './routes/devplan_route.js';
import chatRoute from './routes/chat_route.js';
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

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
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount routes
app.use('/api/chat', chatRoute);
app.use('/api/classify', classifyRoute);
app.use('/api/assessment/about', aboutRoute);
app.use('/api/upload-training', trainingRoute);
app.use('/api/assessment/questions', questionsRoute);
app.use('/api/generate-development-plan', devplanRoute);

// API documentation route
app.get("/", (req, res) => {
  const apiDocs = {
    "/api/upload-training": "Upload training data",
    "/api/classify": "Classify responsibility level",
    "/api/assessment/questions": "Get all assessment questions",
    "/api/assessment/about": "Get all questions about assessment for learn more",
    "/api/assessment/questions/:level": "Get assessment questions by level",
    "/api/assessment/about-questions/:level": "Get questions about assessment by level",
    "/api/generate-development-plan": "Generate development plan"
  };
  res.json({ apiDocs });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Loading data before starting the server
loadData().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error("Failed to load data:", error);
  process.exit(1);
});


