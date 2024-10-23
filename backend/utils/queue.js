import { generateDevelopmentPlan } from "../services/conduct_assesment.js";

export const queueDevPlan = async (data) => {
  try {
    const { projectDetails } = data;

    // Generate the development plan
    const developmentPlan = await generateDevelopmentPlan(projectDetails);

    // Return the result
    return developmentPlan;
  } catch (error) {
    console.error("Error processing development plan job:", error);
    throw error;
  }
};
