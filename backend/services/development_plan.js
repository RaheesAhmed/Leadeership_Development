import OpenAI from "openai";
import dotenv from "dotenv";
import openai from "../lib/openai.js";

dotenv.config();

const openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateDevelopmentPlan = async (assessmentData) => {
  const { ratings, userData, responsibilityLevel } = assessmentData;

  // Aggregate ratings
  const aggregatedRatings = ratings.reduce((acc, rating) => {
    Object.keys(rating).forEach((key) => {
      if (typeof rating[key] === "number") {
        acc[key] = (acc[key] || 0) + rating[key];
      }
    });
    return acc;
  }, {});

  Object.keys(aggregatedRatings).forEach((key) => {
    aggregatedRatings[key] /= ratings.length;
  });

  // Generate Participant Overview
  const overviewPrompt = `
    Generate a Participant Overview based on the following data:
    - Demographic information: ${JSON.stringify(userData)}
    - Self-ratings on 8 capabilities: ${JSON.stringify(aggregatedRatings)}
    - Explanations of skills and confidence: ${JSON.stringify(
      userData.explanations
    )}

    The Participant Overview should:
    1. Provide summarized insights based on the demographic information.
    2. Offer an analyzed and interpreted summary of the self-assessment scores for each capability.
    3. Synthesize insights from the explanations of skills and confidence levels.
    4. Include high-level thoughts on which capabilities the participant should focus on.
  `;

  const overviewResponse = await openaiInstance.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: overviewPrompt }],
  });

  const participantOverview = overviewResponse.choices[0].message.content;

  // Generate Capability Assessments
  const capabilityAssessments = await Promise.all(
    Object.keys(aggregatedRatings).map(async (capability) => {
      const assessmentPrompt = `
        Generate a Capability Assessment based on the following data:
        - Capability: ${capability}
        - Skill rating: ${aggregatedRatings[capability]}
        - Confidence rating: ${aggregatedRatings[capability + "_confidence"]}
        - Subcategory responses: ${JSON.stringify(
          userData.explanations[capability]
        )}
        - Responsibility level: ${responsibilityLevel}

        The Capability Assessment should:
        1. Provide an interpretation of the skill and confidence ratings as they relate to the responsibilities for the specified responsibility level.
        2. Offer observations based on the participant's responses to subcategory questions, related to their responsibility level.
        3. Make observations only, without suggesting actions.
      `;

      const assessmentResponse = await openaiInstance.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: assessmentPrompt }],
      });

      return {
        capability,
        assessment: assessmentResponse.choices[0].message.content,
      };
    })
  );

  // Generate Suggested Actions
  const suggestedActions = await Promise.all(
    Object.keys(aggregatedRatings).map(async (capability) => {
      const actionsPrompt = `
        Generate Suggested Actions for developing the following capability based on the participant's role and responses:
        - Capability: ${capability}
        - Subcategory: ${JSON.stringify(userData.explanations[capability])}
        - Participant's Role: ${userData.role}
        - Participant's Responsibilities: ${responsibilityLevel}
        - Participant's Specific Responses: ${JSON.stringify(
          userData.explanations[capability]
        )}

        The Suggested Actions should:
        1. Provide specific suggestions for development activities.
        2. Include a range of activities such as training, mentoring, podcasts, reading materials, and other relevant activities.
        3. Tailor the suggestions to the participant's unique situation and role.
      `;

      const actionsResponse = await openaiInstance.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: actionsPrompt }],
      });

      return {
        capability,
        actions: actionsResponse.choices[0].message.content,
      };
    })
  );

  return {
    participantOverview,
    capabilityAssessments,
    suggestedActions,
  };
};

export default generateDevelopmentPlan;
