import { z } from "zod";
import dotenv from "dotenv";
import writeDevelopmentPlan from "./development_plan.js";
dotenv.config();

// Define schemas for structured outputs
const CoverPage = z.object({
  title: z.string(),
  participantName: z.string(),
  assessmentDate: z.string(),
});

const ExecutiveSummary = z.object({
  overview: z.string(),
  keyStrengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
});

const PersonalProfile = z.object({
  role: z.string(),
  industry: z.string(),
  yearsOfExperience: z.number(),
  companySize: z.number(),
  responsibilityLevel: z.string(),
});

const AssessmentOverview = z.object({
  scores: z.array(
    z.object({
      capability: z.string(),
      skillScore: z.number(),
      confidenceScore: z.number(),
    })
  ),
  interpretation: z.string(),
});

const CapabilityAnalysis = z.object({
  capabilityName: z.string(),
  overview: z.string(),
  skillRating: z.number(),
  confidenceRating: z.number(),
  selfAssessmentSummary: z.string(),
  focusAreas: z.array(
    z.object({
      name: z.string(),
      importance: z.string(),
      analysis: z.string(),
    })
  ),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  personalizedRecommendations: z.array(
    z.object({
      actionStep: z.string(),
      expectedBenefit: z.string(),
    })
  ),
  recommendedResources: z.array(
    z.object({
      title: z.string(),
      type: z.string(),
      link: z.string(),
    })
  ),
});

const DevelopmentPlan = z.object({
  instructions: z.string(),
  goalSettingTemplate: z.object({
    areaForImprovement: z.string(),
    specificGoal: z.string(),
  }),
  actionPlanningTemplate: z.object({
    actionSteps: z.array(z.string()),
    resources: z.array(z.string()),
    timeline: z.object({
      startDate: z.string(),
      targetDate: z.string(),
    }),
  }),
  progressTrackingTemplate: z.object({
    milestones: z.array(
      z.object({
        description: z.string(),
        targetDate: z.string(),
      })
    ),
    reflections: z.string(),
  }),
  exampleEntry: z.object({
    goal: z.string(),
    actions: z.array(z.string()),
    timeline: z.string(),
  }),
});

const AdditionalResources = z.object({
  tipsForSuccess: z.array(z.string()),
  commonChallenges: z.array(
    z.object({
      challenge: z.string(),
      solution: z.string(),
    })
  ),
  additionalResourceLinks: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      description: z.string(),
    })
  ),
});

const Conclusion = z.object({
  encouragingMessage: z.string(),
  nextSteps: z.array(z.string()),
  contactInformation: z.object({
    email: z.string(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }),
});

const DevelopmentPlanDocument = z.object({
  coverPage: CoverPage,
  executiveSummary: ExecutiveSummary,
  personalProfile: PersonalProfile,
  assessmentOverview: AssessmentOverview,
  detailedAnalysis: z.array(CapabilityAnalysis),
  developmentPlan: DevelopmentPlan,
  additionalResources: AdditionalResources,
  conclusion: Conclusion,
});

// Helper function to create a structured prompt
function createStructuredPrompt(section, userData, assessmentData) {
  return `
As an AI leadership development expert, your task is to generate the ${section} section of a personalized development plan. 
Use the following information about the participant:

${JSON.stringify(userData, null, 2)}

And their assessment results:

${JSON.stringify(assessmentData, null, 2)}

Ensure your response is tailored to the participant's specific role, industry, and responsibility level. 
Maintain a professional yet encouraging tone throughout.
Focus on actionable insights and practical recommendations.

Key guidelines:
1. Personalization: Address the participant by name and reflect their unique profile.
2. Tone and Language: Use clear, encouraging language that motivates engagement.
3. Data Accuracy: Ensure all data from the participant's input and assessment is accurately reflected.
4. Formatting: Use headings, subheadings, bullet points, and numbered lists for readability.
5. Content Generation: Follow the specific guidelines for each section as outlined in the Development Plan structure.
6. Inference and Synthesis: Make reasonable inferences from participant responses to generate meaningful analyses.
7. Resource Recommendation: Suggest appropriate, credible, and relevant resources when applicable.

Your response must strictly adhere to the JSON schema provided for this section. Do not include any content outside of the specified schema structure.
`;
}

export async function generateDevelopmentPlan(
  userData,
  assessmentData,
  instructions
) {
  const developmentPlan = {};
  let memory = null;

  // Helper function to use queryRAGSystem
  async function generateSection(section, schema) {
    const prompt = createStructuredPrompt(section, userData, assessmentData);
    const response = await writeDevelopmentPlan(prompt);
    return schema.parse(response);
  }

  // Generate Cover Page
  developmentPlan.coverPage = await generateSection("Cover Page", CoverPage);

  // Generate Executive Summary
  developmentPlan.executiveSummary = await generateSection(
    "Executive Summary",
    ExecutiveSummary
  );

  // Generate Personal Profile
  developmentPlan.personalProfile = {
    role: userData.jobTitle,
    industry: userData.industry,
    yearsOfExperience: calculateYearsOfExperience(userData.startDate),
    companySize: userData.companySize,
    responsibilityLevel: determineResponsibilityLevel(userData),
  };

  // Generate Assessment Overview
  developmentPlan.assessmentOverview = await generateSection(
    "Assessment Overview",
    AssessmentOverview
  );

  // Generate Detailed Analysis
  developmentPlan.detailedAnalysis = [];
  for (const capability of assessmentData.capabilities) {
    const capabilityAnalysis = await generateSection(
      `Detailed Analysis for ${capability.name}`,
      CapabilityAnalysis
    );
    developmentPlan.detailedAnalysis.push(capabilityAnalysis);
  }

  // Generate Development Plan
  developmentPlan.developmentPlan = await generateSection(
    "Development Plan",
    DevelopmentPlan
  );

  // Generate Additional Resources
  developmentPlan.additionalResources = await generateSection(
    "Additional Resources",
    AdditionalResources
  );

  // Generate Conclusion
  developmentPlan.conclusion = await generateSection("Conclusion", Conclusion);

  // Validate the entire development plan using DevelopmentPlanDocument schema
  try {
    const validatedDevelopmentPlan =
      DevelopmentPlanDocument.parse(developmentPlan);
    return validatedDevelopmentPlan;
  } catch (error) {
    console.error("Development plan validation failed:", error);
    throw new Error("Failed to generate a valid development plan");
  }
}

function calculateYearsOfExperience(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000));
}
