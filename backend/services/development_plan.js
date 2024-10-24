import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateDevelopmentPlan = async (assessmentData) => {
  const { userData, responsibilityLevel, assessmentCompleted, ratings } =
    assessmentData;

  let prompt = `Based on the following information, generate a personalized development plan:

User Information:
${Object.entries(userData)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

Responsibility Level:
${Object.entries(responsibilityLevel)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

`;

  if (assessmentCompleted) {
    prompt += `
Assessment Results:
${ratings.map((rating) => `${rating.question}: ${rating.rating}`).join("\n")}
`;
  } else {
    prompt += `
The user has skipped the assessment. Please provide a general development plan based on their responsibility level and user information.
`;
  }

  prompt += `
Please provide a detailed development plan that includes:
1. Key areas for improvement
2. Specific actionable steps for each area
3. Recommended resources or training programs
4. Short-term and long-term goals
5. Metrics for measuring progress

The plan should be tailored to the individual's current role and responsibility level, taking into account their industry and company size.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating development plan:", error);
    throw error;
  }
};

export default generateDevelopmentPlan;
