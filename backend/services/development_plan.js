import OpenAI from "openai";
import dotenv from "dotenv";
import {
  developmentPlanPrompts,
  formatInstructions,
} from "../prompts/development_plan_prompts.js";
import { DevelopmentPlanDocument } from "../schemas/development_plan_schemas.js";
import { getResourcesByCapability } from "../data/learning_resources.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAIResponse(
  prompt,
  systemInstructions = formatInstructions
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: JSON.stringify(systemInstructions) },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

function replacePlaceholders(prompt, data) {
  let modifiedPrompt = prompt;
  for (const [key, value] of Object.entries(data)) {
    modifiedPrompt = modifiedPrompt.replace(`{${key}}`, value);
  }
  return modifiedPrompt;
}

async function generateSection(promptTemplate, data) {
  const prompt = replacePlaceholders(promptTemplate, data);
  return await generateAIResponse(prompt);
}

function formatAsMarkdown(developmentPlan) {
  return `
## Current Level Assessment
${developmentPlan.executiveSummary.overview}

## Development Areas
${developmentPlan.detailedAnalysis.map((area) => area.overview).join("\n\n")}

## Action Items
${developmentPlan.developmentPlan.actionPlanningTemplate.actionSteps
  .map((item) => `- ${item}`)
  .join("\n")}

## Timeline and Milestones
${developmentPlan.developmentPlan.progressTrackingTemplate.milestones
  .map((m) => `- ${m.description}: ${m.targetDate}`)
  .join("\n")}

## Success Metrics
${developmentPlan.detailedAnalysis
  .map((area) =>
    area.personalizedRecommendations
      .map((rec) => `- ${rec.actionStep}`)
      .join("\n")
  )
  .join("\n")}

## Support and Resources Needed
${developmentPlan.additionalResources.additionalResourceLinks
  .map(
    (resource) =>
      `- [${resource.title}](${resource.link}): ${resource.description}`
  )
  .join("\n")}

---
*Note: This development plan should be reviewed and adjusted periodically based on progress and changing needs.*
`;
}

async function generateAndParseSection(promptTemplate, data) {
  try {
    const response = await generateSection(promptTemplate, data);

    try {
      const parsedResponse = JSON.parse(response);

      // If this is a capability analysis, add curated resources
      if (parsedResponse.capabilityName) {
        parsedResponse.recommendedResources = getResourcesByCapability(
          parsedResponse.capabilityName
        );
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", response);
      throw new Error("AI response was not valid JSON");
    }
  } catch (error) {
    console.error("Error generating section:", error);
    throw error;
  }
}

export async function generateDevelopmentPlan(assessmentData) {
  const { userData, responsibilityLevel, assessmentCompleted, ratings } =
    assessmentData;

  try {
    // Generate cover page
    const coverPageData = {
      participantName: userData.name,
      assessmentDate: new Date().toISOString().split("T")[0],
    };
    const coverPage = await generateAndParseSection(
      developmentPlanPrompts.coverPage,
      coverPageData
    );

    console.log("Cover Page:", coverPage);

    // Generate executive summary
    const summaryData = {
      role: userData.role,
      industry: userData.industry,
      yearsExperience: userData.yearsOfExperience,
      scores: JSON.stringify(ratings),
      challenges: userData.challenges || "",
    };
    const executiveSummary = await generateAndParseSection(
      developmentPlanPrompts.executiveSummary,
      summaryData
    );

    console.log("Executive Summary:", executiveSummary);

    // Generate capability analyses
    const capabilityAnalyses = await Promise.all(
      ratings.map(async (rating) => {
        const capabilityData = {
          capabilityName: rating.question,
          role: userData.role,
          industry: userData.industry,
          yearsExperience: userData.yearsOfExperience,
          level: responsibilityLevel,
          skillRating: rating.rating,
          confidenceRating: rating.confidence,
          responses: rating.comments || "",
        };
        return await generateAndParseSection(
          developmentPlanPrompts.capabilityAnalysis,
          capabilityData
        );
      })
    );

    console.log("Capability Analyses:", capabilityAnalyses);

    // Generate conclusion
    const conclusionData = {
      name: userData.name,
      role: userData.role,
      developmentAreas: ratings
        .filter((r) => r.rating < 4)
        .map((r) => r.question)
        .join(", "),
      recommendations: capabilityAnalyses
        .flatMap((a) => a.personalizedRecommendations || [])
        .map((r) => r.actionStep)
        .join(", "),
    };
    const conclusion = await generateAndParseSection(
      developmentPlanPrompts.conclusion,
      conclusionData
    );

    console.log("Conclusion:", conclusion);

    // Generate development plan template
    const templateData = {
      industry: userData.industry,
      role: userData.role,
      level: responsibilityLevel,
      developmentAreas: ratings
        .filter((r) => r.rating < 4)
        .map((r) => r.question)
        .join(", "),
    };
    const developmentPlanTemplate = await generateAndParseSection(
      developmentPlanPrompts.developmentPlanTemplate,
      templateData
    );

    console.log("Development Plan Template:", developmentPlanTemplate);

    // Create additionalResources object that matches the schema
    const additionalResources = {
      tipsForSuccess: [
        "Regularly review and update your development goals",
        "Seek feedback from peers and mentors",
        "Document your progress and learnings",
      ],
      commonChallenges: [
        {
          challenge: "Time management",
          solution: "Set aside dedicated time for development activities",
        },
        {
          challenge: "Maintaining momentum",
          solution: "Break down goals into smaller, achievable tasks",
        },
      ],
      additionalResourceLinks: capabilityAnalyses
        .flatMap((analysis) => analysis.recommendedResources || [])
        .map((resource) => ({
          title: resource.title || "Resource",
          link: resource.link || "#",
          description: resource.type || "Additional learning resource",
        })),
    };

    // Combine all sections and validate with proper data formatting
    const completePlan = {
      coverPage,
      executiveSummary,
      personalProfile: {
        role: userData.jobTitle || "", // Provide default empty string
        industry: userData.industry || "",
        yearsOfExperience: parseInt(userData.yearsOfExperience || "0"), // Convert to number
        companySize: parseInt(userData.companySize || "0"), // Convert to number
        responsibilityLevel: responsibilityLevel.role || "", // Use the role string
      },
      assessmentOverview: {
        scores: ratings.map((r) => ({
          capability: r.question,
          skillScore: parseInt(r.rating),
          confidenceScore: parseInt(r.confidence || "0"), // Provide default confidence score
        })),
        interpretation: executiveSummary.overview,
      },
      detailedAnalysis: capabilityAnalyses.map((analysis) => ({
        ...analysis,
        confidenceRating: parseInt(analysis.confidenceRating || "0"), // Convert null to number
        skillRating: parseInt(analysis.skillRating),
        focusAreas: analysis.focusAreas.map((area) => ({
          name: area.name || "",
          importance: area.importance || "",
          analysis: area.analysis || "",
        })),
        strengths: analysis.strengths || [],
        areasForImprovement: analysis.areasForImprovement || [],
        personalizedRecommendations: (
          analysis.personalizedRecommendations || []
        ).map((rec) => ({
          actionStep: rec.actionStep || "",
          expectedBenefit: rec.expectedBenefit || "",
        })),
        recommendedResources: (analysis.recommendedResources || []).map(
          (res) => ({
            title: res.title || "",
            type: res.type || "",
            link: res.link || "",
          })
        ),
      })),
      developmentPlan: developmentPlanTemplate,
      additionalResources,
      conclusion,
    };

    // Validate the complete plan
    const validatedPlan = DevelopmentPlanDocument.parse(completePlan);

    // Format as markdown
    const formattedPlan = formatAsMarkdown(validatedPlan);

    return {
      rawPlan: validatedPlan,
      formattedPlan,
    };
  } catch (error) {
    console.error("Error generating development plan:", error);
    throw error;
  }
}

export default generateDevelopmentPlan;
