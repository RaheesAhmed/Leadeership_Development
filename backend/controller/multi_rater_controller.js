import {
  createAssessment,
  addRating,
  getAssessmentWithRatings,
} from "../models/assessment.js";
import generateDevelopmentPlan from "../services/development_plan.js";

export const handleCreateAssessment = async (req, res) => {
  try {
    const { userId, assessmentData } = req.body;
    const assessment = await createAssessment(userId, assessmentData);
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleAddRating = async (req, res) => {
  try {
    const { assessmentId, raterData } = req.body;
    const rating = await addRating(assessmentId, raterData);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleGenerateMultiRaterPlan = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessmentData = await getAssessmentWithRatings(assessmentId);
    const developmentPlan = await generateDevelopmentPlan(assessmentData);
    res.json(developmentPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
