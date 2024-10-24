import { OpenAI } from "openai";
import dotenv from "dotenv";
import generateDevelopmentPlan from "../services/development_plan.js";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const assistantId = process.env.OPENAI_ASSISTANT_ID;

const openai = new OpenAI({ apiKey });

export const handleGenerateDevelopmentPlan = async (req, res) => {
  try {
    const { userInfo, responsibilityLevel, answers, assessmentCompleted } =
      req.body;
    console.log({ userInfo, responsibilityLevel, assessmentCompleted });

    let assessmentData = {
      userData: userInfo,
      responsibilityLevel: responsibilityLevel,
      assessmentCompleted: assessmentCompleted,
      ratings: assessmentCompleted ? answers : [],
    };

    const developmentPlan = await generateDevelopmentPlan(assessmentData);

    res.status(200).json({ plan: developmentPlan });
  } catch (error) {
    console.error("Error generating development plan:", error);
    res.status(500).json({ error: "Failed to generate development plan" });
  }
};
